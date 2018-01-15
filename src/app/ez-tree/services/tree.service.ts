import { Injectable, EventEmitter } from '@angular/core';
import { Node } from '../model/model';

@Injectable()
export class TreeService {

  nodeExpanded: EventEmitter<Node> = new EventEmitter<Node>();
  nodeCollapsed: EventEmitter<Node> = new EventEmitter<Node>();

  constructor() { }

}
