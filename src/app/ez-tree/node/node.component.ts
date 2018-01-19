import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { Node, Templates } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-node',
	template: `
		<li [tabindex]="node.Parent ? 0 : -1" [ngClass]="{'root-node': !node.Parent, 'last-node': node.IsLastChild}" aria-expanded="false" (focus)="onFocus()" (blur)="onBlur()" [setFocus]="node.HasFocus">
			<i (click)="onToggle()" *ngIf="node.HasChildren && !node.IsExpanded" class="material-icons">add_circle</i>
			<i (click)="onToggle()" *ngIf="node.HasChildren && node.IsExpanded" class="material-icons">remove_circle</i>
			<span *ngIf="!templates">{{node.Name}}</span>				
			<ng-container *ngIf="templates" [ngTemplateOutlet]="templates.nameTemplate" [ngTemplateOutletContext]="{ $implicit: node, node: node }"></ng-container>
			<ul *ngIf="node.HasChildren && node.IsExpanded">
				<span *ngIf="!node.Children.length && !templates.loadingTemplate">Loading...</span>		
				<ng-container *ngIf="!node.Children.length && templates.loadingTemplate" [ngTemplateOutlet]="templates.loadingTemplate"></ng-container>	
				<ez-node  *ngFor="let childNode of node.Children; index as i" [node]="childNode" [parent]="node" [index]="i" [templates]="templates"></ez-node>
			</ul>
		</li>
	`,
	styles: [`
		li.root-node, li.last-node {
			border: 0;
			position: relative:
		}

		ul {
			font: normal normal 14px/20px Helvetica, Arial, sans-serif;
			list-style-type: none;
			margin: 0;
			padding-left: 7px;
			position: relative;
			overflow: hidden;
		}
		
		li {
			list-style-type: none;
			margin: 0;
			padding: 0 12px;	
			position: relative;
			border-left: 1px dotted #999;
		}
		
		li.last-node {
			padding-left: 13px;
		}
		
		li::before,
		li::after {
			content: '';
			position: absolute;
			left: 0;
		}
		
		/* horizontal line on inner list items */
		li:not(.root-node):not(.last-node)::before {
			border-top: 1px dotted #999;
			top: 10px;
			width: 10px;
			height: 0;
		}

		/* horizontal line on last child */
		li.last-node::before {
			position: absolute;
			top: 0;
			left: 0;
			bottom: calc(100% - 10px);
			right: calc(100% - 11px);
			border-left: 1px dotted #999;
			border-bottom: 1px dotted #999;
		}

		span {
			vertical-align: middle;
		}

		li:focus {
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
