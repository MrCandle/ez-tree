import {
  Component, OnInit, OnChanges, OnDestroy,
  SimpleChanges, Renderer2, Input, Output, EventEmitter, ContentChild, TemplateRef
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'ez-tree',
  template: `
    <ul>
      <li tabindex="0" aria-expanded="true" (focus)="onTreeFocus()" (blur)="onTreeBlur()">
        <span>{{tree.Name}}</span>
        <ng-template [ngIf]="tree.HasChildren">
          <ez-node *ngFor="let child of tree.Children" [node]="child" [template]="customTemplate"></ez-node>
        </ng-template>
      </li>
    </ul>

    <h5>Focus: {{hasFocus}}</h5>
    <h5>FocusedNode: {{focusedNode.Name}}</h5>
    <h5>Tree:
      <pre>{{tree | json}}</pre>
    </h5>
  `,
  styles: [``]
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {

  @Input() tree: Node;

  @Output() onSelect: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onExpand: EventEmitter<Node> = new EventEmitter<Node>();
  @Output() onCollapse: EventEmitter<Node> = new EventEmitter<Node>();

  @ContentChild('customTemplate') customTemplate: TemplateRef<any>;

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
    if (this.focusedNode.HasChildren && this.focusedNode.Children.length) {
      this.focusedNode = this.focusedNode.Children[0];
    } else {
      // get sibling
    }
  }
}
