import { Injectable } from '@angular/core';
import { Node } from '../model/model';

@Injectable()
export class TreeService {

  tree: Node;

  
  constructor() { }

  setTree(newTree: Node){
    this.tree = newTree;
  }

  nodeExpanded(node: Node){

  }

  nodeCollapsed(node: Node){

  }

  expand(nodeId: number){

  }

  collapse(nodeId: number){

  }
}
