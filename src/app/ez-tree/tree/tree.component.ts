import {
	Component, OnInit, OnChanges, OnDestroy,
	SimpleChanges, Renderer2, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-tree',
	encapsulation: ViewEncapsulation.None,
	template: `
			<ez-node class="tree" [setFocus]="tree.HasFocus" [node]="tree" [index]="i" [template]="customTemplate"></ez-node>
  `,
	styles: [`
    .tree,
    .tree ul {
      font: normal normal 14px/20px Helvetica, Arial, sans-serif;
      list-style-type: none;
      margin-left: 0 0 0 10px;
      padding-left: 7px;
      position: relative;
      overflow: hidden;
    }
    
    .tree li {
      margin: 0;
      padding: 0 12px;	
      position: relative;
    }
    
    .tree li::before,
    .tree li::after {
      content: '';
      position: absolute;
      left: 0;
    }
    
    /* horizontal line on inner list items */
    .tree li::before {
      border-top: 1px solid #999;
      top: 10px;
      width: 10px;
      height: 0;
    }    
    
    /* vertical line on list items */
    .tree li:after {
      border-left: 1px solid #999;
      height: 100%;
      width: 0px;
      top: -10px;
    }
    
    /* lower line on list items from the first level because they don't have parents */
    .tree>li::after {
      top: 10px;
    }
    
    /* hide line from the last of the first level list items */
    .tree>li:last-child::after {
      display: none;
    }

    .tree>li:first-child::before {
      display: none;
    }
    
    .tree ul:last-child li:last-child:after {
      height: 20px;
    }

    span, .material-icons {
			vertical-align: middle;
		}

		.material-icons {
			font-size: 14px;
			cursor: pointer;
		}

		li:focus {
			border: red 1px solid;
			
		}
  `]
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

	@Input() tree: Node;

	@Output() onSelect: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onExpand: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onCollapse: EventEmitter<Node> = new EventEmitter<Node>();

	@ContentChild('customTemplate') customTemplate: TemplateRef<any>;

	focusedNode: Node;
	listenFunc: Function;

	constructor(private treeService: TreeService, private renderer: Renderer2) { }

	ngOnInit() {
		this.tree.IsExpanded = true;
		this.tree.ChildIndex = 0;
		this.focusedNode = this.tree;

		this.treeService.nodeFocused.subscribe((node: Node) => {
			this.focusedNode = node;
			this.onTreeFocus();
		});

		this.treeService.nodeBlured.subscribe((node: Node) => {
			this.onTreeBlur();
		});

		this.treeService.nodeExpanded.subscribe((node: Node) => {
			// if (node.Children.length === 0 && node.HasChildren) {
			this.onExpand.emit(node);
			// }
		})

		this.treeService.nodeCollapsed.subscribe((node: Node) => {
			this.onCollapse.emit(node);
		})

		this.treeService.nodeSelected.subscribe((node: Node) => {
			this.onSelect.emit(node);
		})

	}

	ngOnChanges(changes: SimpleChanges) {
		// implement this
		// this.treeService.setTree(this.tree);
	}

	ngOnDestroy() {
		this.listenFunc();
		// unsubscribe from everything
	}

	onTreeFocus() {
		this.listenFunc = this.renderer.listen('document', 'keydown', (evt) => {
			console.log(evt);
			if (evt.isTrusted) {
				switch (evt.code) {
					case 'ArrowRight': {
						this.expandNode();
						break;
					}
					case 'ArrowLeft': {
						this.collapseNode();
						break;
					}
					case 'ArrowUp': {
						this.focusPreviousNode()
						break;
					}
					case 'ArrowDown': {
						this.focusNextNode();
						break;
					}
					case 'Home': {
						this.focusRoot();
						break;
					}
					case 'Enter': {
						this.selectNode();
						break;
					}
					case 'Space': {
						this.selectNode();
						break;
					}
				}
				evt.preventDefault();
			}
		});
	}

	onTreeBlur() {
		this.focusedNode = this.tree;
		this.listenFunc();
	}

	onToggle() {
		this.treeService.onToggle(this.tree);
	}

	focusPreviousNode() {
		this.focusedNode.HasFocus = false;
		if (this.focusedNode.ChildIndex > 0) {
			// Current Node is not the first child
			let previousSibling: Node = this.focusedNode.Parent.Children[this.focusedNode.ChildIndex - 1];
			if (previousSibling.IsExpanded && previousSibling.Children.length) {
				this.focusedNode = previousSibling.Children[previousSibling.Children.length - 1];
			} else {
				this.focusedNode = previousSibling;
			}
		} else {
			// Current node is the first child and is not the root node.
			if (this.focusedNode.Parent) {
				this.focusedNode = this.focusedNode.Parent;
			}
		}
		this.focusedNode.HasFocus = true;
	}

	focusNextNode() {
		this.focusedNode.HasFocus = false;
		if (this.focusedNode.IsExpanded && this.focusedNode.HasChildren && this.focusedNode.Children.length) {
			// Node is Expanded --> focus first child.
			this.focusedNode = this.focusedNode.Children[0];
		} else if (this.focusedNode.Parent && this.focusedNode.ChildIndex < this.focusedNode.Parent.Children.length - 1) {
			// Node is not root and is not the last child --> focus next sibling.
			this.focusedNode = this.focusedNode.Parent.Children[this.focusedNode.ChildIndex + 1];
		} else if (this.focusedNode.ChildIndex === this.focusedNode.Parent.Children.length - 1) {
			// Node is last child --> Focus parent's next sibling.

		}
		this.focusedNode.HasFocus = true;
	}

	expandNode() {
		this.focusedNode.IsExpanded = true;
	}

	collapseNode() {
		this.focusedNode.IsExpanded = false;
	}

	focusRoot() {

	}

	focusNode() {

	}

	selectNode() {

	}
}
