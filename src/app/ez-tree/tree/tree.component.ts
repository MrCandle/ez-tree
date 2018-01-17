import {
  Component, OnInit, OnChanges, OnDestroy,
  SimpleChanges, Renderer2, Input, Output, EventEmitter
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'ez-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tree: Node;

  @Output() onSelect: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onExpand: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onCollapse: EventEmitter<Node> = new EventEmitter<Node>();

  hasFocus = false;
  focusedNode: Node = new Node();
  listenFunc: Function;

  constructor(private treeService: TreeService, private renderer: Renderer2) { }

  ngOnInit() {
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
    this.hasFocus = true;
    this.listenFunc = this.renderer.listen('document', 'keydown', (evt) => {
      if (evt.isTrusted) {
        switch (evt.code) {
          case 'ArrowRight': {
            // expand node
            break;
          }
          case 'ArrowLeft': {
            // collapse node
            break;
          }
          case 'ArrowUp': {
            // select previous node
            break;
          }
          case 'ArrowDown': {
            this.focusNextNode();
            break;
          }
        }
      }
    });
  }

  onTreeBlur() {
    this.hasFocus = false;
    this.focusedNode = new Node();
    this.listenFunc();
  }

  focusNextNode() {
    // if (node.hasChildren && node.IsExpanded) {
    // this.focusedNode = this.focusedNode.Children[0];
    // } else {
    // 
    // }
  }
}
