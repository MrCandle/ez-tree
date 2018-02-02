import { Injectable, EventEmitter } from '@angular/core';
import { Node } from '../model/model';
import { TreeController } from '../tree/tree-controller'

@Injectable()
export class TreeService {

  nodeExpanded: EventEmitter<Node> = new EventEmitter<Node>();
  nodeCollapsed: EventEmitter<Node> = new EventEmitter<Node>();
  nodeFocused: EventEmitter<Node> = new EventEmitter<Node>();
  nodeBlured: EventEmitter<Node> = new EventEmitter<Node>();
  nodeSelected: EventEmitter<Node> = new EventEmitter<Node>();

  private controllers: Map<number, TreeController> = new Map();

  constructor() { }

  public setController(id: number, controller: TreeController): void {
    this.controllers.set(id, controller);
  }

  public deleteController(id: number): void {
    if (this.controllers.has(id)) {
      this.controllers.delete(id);
    }
  }

  public getController(id: number): TreeController {
    if (this.controllers.has(id)) {
      return this.controllers.get(id);
    }

    return null;
  }

  public hasController(id: number): boolean {
    return this.controllers.has(id);
  }

}
