import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Node, Templates } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-node',
	encapsulation: ViewEncapsulation.None,
	template: `
		<li [tabindex]="node.Parent ? 0 : -1" [ngClass]="{'root-node': !node.Parent, 'last-node': node.IsLastChild}" aria-expanded="false" (focus)="onFocus()" (blur)="onBlur()" [setFocus]="node.HasFocus">
			<div (click)="onToggle()" *ngIf="node.HasChildren" class="svg" [ngClass]="{'collapsed': !node.IsExpanded, 'expanded': node.IsExpanded}"></div>
			<span *ngIf="!templates">{{node.Name}}</span>				
			<ng-container *ngIf="templates" [ngTemplateOutlet]="templates['nameTemplate']" [ngTemplateOutletContext]="{ $implicit: node, node: node }"></ng-container>
			<ul *ngIf="node.HasChildren && node.IsExpanded">
				<span *ngIf="!node.Children.length && !templates.loadingTemplate">Loading...</span>		
				<ng-container *ngIf="!node.Children.length && templates['loadingTemplate']" [ngTemplateOutlet]="templates['loadingTemplate']"></ng-container>	
				<ez-node  *ngFor="let childNode of node.Children; index as i" [node]="childNode" [parent]="node" [index]="i" [templates]="templates"></ez-node>
			</ul>
		</li>
	`,
	styles: [`
		.svg {
			background-size: 100% 100%;
			width: 16px;
			height: 16px;
			cursor: pointer;
			float: left;
		}

		.svg.collapsed {
			background-image: url(../img/expand.svg);			
		}

		.svg.expanded {
			background-image: url(../img/collapse.svg);			
		}

		ez-node li.root-node, ez-node li.last-node {
			border: 0;
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
			border-left: 1px solid #596733;
		}
		
		ez-node li::before,
		ez-node li::after {
			content: '';
			position: absolute;
			left: 0;
		}
		
		/* horizontal line on inner list items */
		ez-node li:not(.root-node)::before {
			border-top: 1px solid #596733;
			top: 10px;
			width: 8px;
			height: 0;
		}

		/* horizontal line on last child */
		ez-node li.last-node::before {
			border-left: 1px solid #596733;
			top: 0;
			width: 1px;
			height: 0;
		}
	
		ez-node li:focus {
			border: red 1px solid;
		}
	`]
})
export class NodeComponent implements OnInit {

	@Input() node: Node;
	@Input() parent: Node;
	@Input() index: number;
	@Input() templates: Templates;

	constructor(private treeService: TreeService) { }

	ngOnInit() {
		this.node.Parent = this.parent;
		this.node.ChildIndex = this.index;

		if (this.node.Parent && this.node.ChildIndex === this.node.Parent.Children.length - 1) {
			this.node.IsLastChild = true;
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

	onSelect() {
		this.node.HasFocus = true;
		this.treeService.nodeSelected.emit(this.node);
	}

}
