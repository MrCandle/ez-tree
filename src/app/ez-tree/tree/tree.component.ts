import {
	Component, OnInit, OnChanges, OnDestroy,
	SimpleChanges, Renderer2, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation, HostListener
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
	selector: 'ez-tree',
	encapsulation: ViewEncapsulation.None,
	template: `<ez-node class="root-node" [setFocus]="tree.HasFocus" [node]="tree" [templates]="{nameTemplate: nameTemplate, loadingTemplate: loadingTemplate, toggleTemplate: toggleTemplate}"></ez-node>`,
	styles: [``]
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

	@Input() tree: Node;

	@Output() onSelect: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onExpand: EventEmitter<Node> = new EventEmitter<Node>();
	@Output() onCollapse: EventEmitter<Node> = new EventEmitter<Node>();

	@ContentChild('nameTemplate') nameTemplate: TemplateRef<any>;
	@ContentChild('loadingTemplate') loadingTemplate: TemplateRef<any>;
	@ContentChild('toggleTemplate') toggleTemplate: TemplateRef<any>;

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
		if (this.listenFunc) { this.listenFunc(); }
		// unsubscribe from everything
	}

	onTreeFocus() {
		this.listenFunc = this.renderer.listen('document', 'keydown', (evt) => {
			if (evt.isTrusted) {
				switch (evt.code) {
					case 'ArrowRight': {
						this.expandNode();
						evt.preventDefault();
						break;
					}
					case 'ArrowLeft': {
						this.collapseNode();
						evt.preventDefault();
						break;
					}
					case 'ArrowUp': {
						this.focusPreviousNode();
						evt.preventDefault();
						break;
					}
					case 'ArrowDown': {
						this.focusNextNode();
						evt.preventDefault();
						break;
					}
					case 'Home': {
						this.focusRoot();
						evt.preventDefault();
						break;
					}
					case 'Enter': {
						this.selectNode();
						evt.preventDefault();
						break;
					}
					case 'Space': {
						this.selectNode();
						evt.preventDefault();
						break;
					}
				}
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
			this.treeService.nodeExpanded.emit(this.focusedNode);
		}
	}

	collapseNode() {
		if (this.focusedNode.IsExpanded) {
			this.focusedNode.IsExpanded = false;
			this.treeService.nodeCollapsed.emit(this.focusedNode);
		}
	}

	focusRoot() {
		this.focusedNode.HasFocus = false;
		this.focusedNode = this.tree;
		this.focusedNode.HasFocus = true;
	}

	selectNode() {
		if (!this.focusedNode.isDisabled) {
			this.focusedNode.IsSelected = true;
			this.treeService.nodeSelected.emit(this.focusedNode);
		}
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
