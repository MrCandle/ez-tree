import {
  Component, OnInit, OnChanges, OnDestroy,
  SimpleChanges, Renderer2, Input, Output, EventEmitter
} from '@angular/core';

import { Node } from '../model/model';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tree: Node[];
  
  @Output() select: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() expand: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() collapse: EventEmitter<Node> = new EventEmitter<Node>();
  
  hasFocus: boolean = false;
  activeNode: number;
  listenFunc: Function;

  constructor(private renderer: Renderer2) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {

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
            // select next node
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
}
