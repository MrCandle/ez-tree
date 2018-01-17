import { Component, Input, OnChanges, SimpleChanges, TemplateRef, ViewEncapsulation } from '@angular/core';
import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-node',
	template: `
		<li tabindex="-1" aria-expanded="false" (focus)="onFocus()" (blur)="onBlur()">
			<i (click)="onToggle()" *ngIf="node.HasChildren && !isExpanded" class="material-icons">add_circle</i>
			<i (click)="onToggle()" *ngIf="node.HasChildren && isExpanded" class="material-icons">remove_circle</i>
			<span>{{node.Name}}</span>		
			<ul *ngIf="node.HasChildren && isExpanded">
				<span *ngIf="!node.Children.length">Loading...</span>
				<ez-node *ngFor="let childNode of node.Children" [node]="childNode" [template]="template"></ez-node>
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
	`]
})
export class NodeComponent implements OnChanges {

	@Input() node: Node;
	@Input() template: TemplateRef<any>;

	isExpanded = false;

	constructor(private treeService: TreeService) { }

	ngOnChanges(changes: SimpleChanges) {
		this.node = changes.node.currentValue;
	}

	onToggle() {
		if (!this.node.HasChildren) { return false; }

		if (this.isExpanded) {
			this.treeService.nodeCollapsed.emit(this.node);
		} else {
			this.treeService.nodeExpanded.emit(this.node);
		}
		this.isExpanded = !this.isExpanded;
	}

	onFocus() {
		this.treeService.nodeFocused.emit(this.node);
	}

	onBlur() {
		this.treeService.nodeBlured.emit(this.node);
	}

	onSelect() {
		this.treeService.nodeSelected.emit(this.node);
	}
}
