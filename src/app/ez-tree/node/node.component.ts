import { Component, Input, OnInit, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-node',
	template: `
		<li tabindex="-1" aria-expanded="false" (focus)="onFocus()" (blur)="onBlur()" [setFocus]="node.HasFocus">
			<i (click)="onToggle()" *ngIf="node.HasChildren && !node.IsExpanded" class="material-icons">add_circle</i>
			<i (click)="onToggle()" *ngIf="node.HasChildren && node.IsExpanded" class="material-icons">remove_circle</i>
			<span *ngIf="!template" [ngClass]="{'focused': node.HasFocus}">{{node.Name}}</span>				
			<ng-container *ngIf="template" [ngTemplateOutlet]="template" [ngTemplateOutletContext]="{ $implicit: node, node: node }"></ng-container>
			<ul *ngIf="node.HasChildren && node.IsExpanded">
				<span *ngIf="!node.Children.length">Loading...</span>
				<ez-node  *ngFor="let childNode of node.Children; index as i" [node]="childNode" [parent]="node" [index]="i" [template]="template"></ez-node>
			</ul>
		</li>
	`,
	styles: [`
		span, .material-icons {
			vertical-align: middle;
		}

		.material-icons {
			font-size: 14px;
			cursor: pointer;
		}

		.focused {
			border: red 1px solid;
		}
	`]
})
export class NodeComponent implements OnInit {

	@Input() node: Node;
	@Input() parent: Node;
	@Input() index: number;
	@Input() template: TemplateRef<any>;

	constructor(private treeService: TreeService) { }

	ngOnInit() {
		this.node.Parent = this.parent;
		this.node.ChildIndex = this.index;
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
