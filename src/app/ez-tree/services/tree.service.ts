import { Injectable, EventEmitter } from '@angular/core';
import { Node } from '../model/model';

@Injectable()
export class TreeService {

  nodeExpanded: EventEmitter<Node> = new EventEmitter<Node>();
  nodeCollapsed: EventEmitter<Node> = new EventEmitter<Node>();
  nodeFocused: EventEmitter<Node> = new EventEmitter<Node>();
  nodeBlured: EventEmitter<Node> = new EventEmitter<Node>();

  constructor() { }

}
