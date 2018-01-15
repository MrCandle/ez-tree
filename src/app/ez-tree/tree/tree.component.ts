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
  @Input() lazy: boolean;

  @Output() select: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() expand: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() collapse: EventEmitter<Node> = new EventEmitter<Node>();
  
  hasFocus: boolean = false;
  focusedNode: number;
  listenFunc: Function;

  constructor(private treeService: TreeService, private renderer: Renderer2) { }

  ngOnInit() {
    this.treeService.setTree(this.tree);
  }

  ngOnChanges(changes: SimpleChanges) {
    // implement this
    // this.treeService.setTree(this.tree);
  }

  ngOnDestroy() {
    this.listenFunc();
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
    })
  }

  onTreeBlur() {
    this.hasFocus = false;
    this.listenFunc();
  }

  focusNextNode(){
    // if (node.hasChildren && node.IsExpanded) {
      // this.focusedNode = this.focusedNode.Children[0];
    // } else {
      // 
    // }
  }
}
