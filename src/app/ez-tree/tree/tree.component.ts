import {
	Component, OnInit, OnChanges, OnDestroy,
	SimpleChanges, Renderer2, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-tree',
	encapsulation: ViewEncapsulation.None,
	template: `<ez-node class="tree" [setFocus]="tree.HasFocus" [node]="tree" [templates]="{nameTemplate: nameTemplate, loadingTemplate: loadingTemplate}"></ez-node>`,
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

		.tree span, .material-icons {
			vertical-align: middle;
		}

		.material-icons {
			font-size: 14px;
			cursor: pointer;
		}

		.tree li:focus {
			border: red 1px solid;		
		}
  `]
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

	@Input() tree: Node;

	@Output() onSelect: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onExpand: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onCollapse: EventEmitter<Node> = new EventEmitter<Node>();

	@ContentChild('nameTemplate') nameTemplate: TemplateRef<any>;
	@ContentChild('loadingTemplate') loadingTemplate: TemplateRef<any>;

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
			this.onExpand.emit(node);
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

	focusPreviousNode() {
		this.focusedNode.HasFocus = false;
		if (this.focusedNode.ChildIndex > 0) {
			// Current Node is not the first child --> Get Previous Sibling
			let previousSibling: Node = this.focusedNode.Parent.Children[this.focusedNode.ChildIndex - 1];
			this.focusLastChild(previousSibling);
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
			this.focusParentSibling(this.focusedNode);
		}
		this.focusedNode.HasFocus = true;
	}

	expandNode() {
		if (this.focusedNode.HasChildren && !this.focusedNode.IsExpanded) {
			this.focusedNode.IsExpanded = true;
			this.onExpand.emit(this.focusedNode);
		}
	}

	collapseNode() {
		if (this.focusedNode.IsExpanded) {
			this.focusedNode.IsExpanded = false;
			this.onCollapse.emit(this.focusedNode);
		}
	}

	focusRoot() {
		this.focusedNode.HasFocus = false;
		this.focusedNode = this.tree;
		this.focusedNode.HasFocus = true;
	}

	selectNode() {
		this.focusedNode.IsSelected = true;
		this.onSelect.emit(this.focusedNode);
	}

	private focusParentSibling(node: Node) {
		if (!node.Parent || !node.Parent.Parent) {
			// we have reached the root
			return;
		}

		let parent: Node = node.Parent;
		if (parent.ChildIndex === parent.Parent.Children.length - 1) {
			// Parent is the last child also --> Search in the next parent.
			this.focusParentSibling(parent);
		} else {
			// Parent is not the last child --> Focus next sibling.	
			this.focusedNode = parent.Parent.Children[parent.ChildIndex + 1];
		}
	}

	private focusLastChild(node: Node) {
		if (node.IsExpanded && node.HasChildren && node.Children.length > 0) {
			this.focusLastChild(node.Children[node.Children.length - 1]);
		} else {
			this.focusedNode = node;
		}
	}
}
