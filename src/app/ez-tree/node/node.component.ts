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

		ngOnChanges(changes: SimpleChanges){
			this.node = changes.node.currentValue;
		}

    toggle() {
        if (!this.node.HasChildren) { return false; }

        if (this.isExpanded) {
            this.treeService.nodeCollapsed.emit(this.node);
        } else {
            this.treeService.nodeExpanded.emit(this.node);
        }
        this.isExpanded = !this.isExpanded;
    }

    setFocusNode() {
        this.treeService.nodeFocused.emit(this.node);
    }

    onBlurNode() {
        this.treeService.nodeBlured.emit(this.node);
    }
}
