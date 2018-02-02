import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';
import { NodeComponent } from '../node/node.component';


export class TreeController {

    private tree: Node;
    private treeService: TreeService;

    constructor(private component: NodeComponent) {
        this.tree = this.component.node;
        this.treeService = this.component.treeService;
    }

    public select(): void {
        if (!this.isSelected()) {
            this.component.onSelect(false);
        }
    }

    public unSelect(): void {
        if (this.isSelected()) {
            this.component.onUnSelect();
        }
    }

    private isSelected(): boolean {
        return this.tree.IsSelected;
    }

}