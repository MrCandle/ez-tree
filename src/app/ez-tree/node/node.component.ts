import { Component, Input, OnInit, TemplateRef, ViewEncapsulation, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { Node, Templates } from '../model/model';
import { TreeService } from '../services/tree.service';
import { TreeController } from '../tree/tree-controller';

@Component({
	selector: 'ez-node',
	encapsulation: ViewEncapsulation.None,
	template: `
		<li [tabindex]="node.Parent ? -1 : 0" [ngClass]="{'root-node': !node.Parent, 'last-node': node.IsLastChild}" role="treeitem" [attr.aria-setsize]="node.ParentSetSize" [attr.aria-posinset]="node.ChildIndex + 1" [attr.aria-level]="node.Level" [attr.aria-expanded]="!node.HasChildren ? '' : node.IsExpanded" (focus)="onFocus()" (blur)="onBlur()" [setFocus]="node.HasFocus">
			<div (click)="onToggle()" *ngIf="node.HasChildren && !templates['toggleTemplate']" class="toggle" [ngClass]="{'collapsed': !node.IsExpanded, 'expanded': node.IsExpanded}"></div>
			<div (click)="onToggle()" *ngIf="node.HasChildren && templates['toggleTemplate']">
				<ng-container *ngIf="templates['toggleTemplate']" [ngTemplateOutlet]="templates['toggleTemplate']" [ngTemplateOutletContext]="{ $implicit: node, node: node }"></ng-container>
			</div>
			<span *ngIf="!templates['nameTemplate']" (click)="onSelect(false)">{{node.Name}}</span>
			<div (click)="onSelect(false)">				
				<ng-container *ngIf="templates['nameTemplate']" [ngTemplateOutlet]="templates['nameTemplate']" [ngTemplateOutletContext]="{ $implicit: node, node: node }"></ng-container>
			</div>
			<ul *ngIf="node.HasChildren && node.IsExpanded" role="group">
				<span *ngIf="!node.Children.length && !templates['loadingTemplate']">Loading...</span>
				<ng-container *ngIf="!node.Children.length && templates['loadingTemplate']" [ngTemplateOutlet]="templates['loadingTemplate']"></ng-container>	
				<ez-node  *ngFor="let childNode of node.Children; index as i" [node]="childNode" [parent]="node" [index]="i" [templates]="templates"></ez-node>
			</ul>
		</li>
	`,
	styles: [`
		.toggle {
			background-size: 100% 100%;
			width: 16px;
			height: 16px;
			cursor: pointer;
			float: left;
		
		}

		.toggle.collapsed:before {
			content: '+';
		}

		.toggle.expanded:before {
			content: '-';
		}

		ez-node li.root-node, ez-node li.last-node {
			border: 0;
			position: relative:
		}

		ez-node ul {
			list-style-type: none;
			margin: 0;
			padding-left: 7px;
			position: relative;
			overflow: hidden;
		}
		
		ez-node li {
			list-style-type: none;
			margin: 0;
			padding: 0 12px;	
			position: relative;
			border-left: 1px solid #1E5180;
		}

		ez-node li::before,
		ez-node li::after {
			content: '';
			position: absolute;
			left: 0;
		}
		
		/* horizontal line on inner list items */
		ez-node li:not(.root-node):not(.last-node)::before {
			border-top: 1px solid #1E5180;
			top: 10px;
			width: 8px;
			height: 0;
		}

		/* horizontal line on last child */
		ez-node li.last-node::before {
			top: 0;
			left: 0;
			bottom: calc(100% - 10px);
			right: calc(100% - 10px);
			border-left: 1px solid #1E5180;
			border-bottom: 1px solid #1E5180;
		}
	`]
})
export class NodeComponent implements OnInit, OnChanges, OnDestroy {

	@Input() node: Node;
	@Input() parent: Node;
	@Input() index: number;
	@Input() templates: Templates;

	public controller: TreeController;

	constructor(public treeService: TreeService) { }

	ngOnInit() {
		this.node.Parent = this.parent;
		this.node.ChildIndex = this.index;

		if (this.node.Parent) {
			this.node.ParentSetSize = this.node.Parent.Children.length;
			if (this.node.ChildIndex === this.node.Parent.Children.length - 1) {
				this.node.IsLastChild = true;
			}
		}

		this.controller = new TreeController(this);
		if (!this.treeService.getController(this.node.Id)) {
			this.treeService.setController(this.node.Id, this.controller);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['node'].currentValue.IsSelected) { this.onSelect(true); }
		this.controller = new TreeController(this);
	}

	ngOnDestroy() {
		if (this.treeService.getController(this.node.Id)) {
			this.treeService.deleteController(this.node.Id);
		}
		if (this.node.IsSelected) {
			this.treeService.nodeSelected.emit(null);
		}
	}

	onToggle() {
		if (!this.node.HasChildren) { return false; }

		if (this.node.IsExpanded) {
			this.treeService.nodeCollapsed.emit(this.node);
		} else {
			this.treeService.nodeExpanded.emit(this.node);
		}
		this.node.IsExpanded = !this.node.IsExpanded;
	}

	onFocus() {
		this.node.HasFocus = true;
		this.treeService.nodeFocused.emit(this.node);
	}

	onBlur() {
		this.node.HasFocus = false;
		this.treeService.nodeBlured.emit(this.node);
	}

	onSelect(forceUpdate: boolean) {
		if (!this.node.IsSelected || forceUpdate) {
			if (!this.node.isDisabled) {
				this.node.HasFocus = true;
				this.node.IsSelected = true;
				this.treeService.nodeSelected.emit(this.node);
			}
		}
	}

	onUnSelect() {
		this.node.HasFocus = false;
		this.node.IsSelected = false;
	}

}
