import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-node',
	templateUrl: './node.component.html'
})
export class NodeComponent implements OnChanges {

	@Input() node: Node;

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
