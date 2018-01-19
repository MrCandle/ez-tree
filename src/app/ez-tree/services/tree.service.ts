import { Injectable, EventEmitter } from '@angular/core';
import { Node } from '../model/model';

@Injectable()
export class TreeService {

  nodeExpanded: EventEmitter<Node> = new EventEmitter<Node>();
  nodeCollapsed: EventEmitter<Node> = new EventEmitter<Node>();
  nodeFocused: EventEmitter<Node> = new EventEmitter<Node>();
  nodeBlured: EventEmitter<Node> = new EventEmitter<Node>();
  nodeSelected: EventEmitter<Node> = new EventEmitter<Node>();

  constructor() { }

  onToggle(node: Node) {
    if (!node.HasChildren) { return false; }

    if (node.IsExpanded) {
      this.nodeCollapsed.emit(node);
    } else {
      this.nodeExpanded.emit(node);
    }
    node.IsExpanded = !node.IsExpanded;
  }

}
