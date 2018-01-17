import {
  Component, OnInit, OnChanges, OnDestroy,
  SimpleChanges, Renderer2, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewEncapsulation
} from '@angular/core';

import { Node } from '../model/model';
import { TreeService } from '../services/tree.service';

@Component({
  selector: 'ez-tree',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ul class="tree" tabindex="0" aria-expanded="true" (focus)="onTreeFocus()" (blur)="onTreeBlur()">
      <li>
        <i class="material-icons">add_circle</i>    
        <span>{{tree.Name}}</span>
        <ul>
          <ez-node *ngFor="let child of tree.Children" [node]="child" [template]="customTemplate"></ez-node>
        </ul>
      </li>
    </ul>

    <h5>Focus: {{hasFocus}}</h5>
    <h5>FocusedNode: {{focusedNode.Name}}</h5>
    <h5>Tree:
      <pre>{{tree | json}}</pre>
    </h5>
  `,
  styles: [`
    .tree,
    .tree ul {
      font: normal normal 14px/20px Helvetica, Arial, sans-serif;
      list-style-type: none;
      margin-left: 0 0 0 10px;
      padding-left: 7px;
      position: relative;
      overflow: hidden;
    }
    
    .tree li {
      margin: 0;
      padding: 0 12px;
      position: relative;
    }
    
    .tree li::before,
    .tree li::after {
      content: '';
      position: absolute;
      left: 0;
    }
    
    /* horizontal line on inner list items */
    .tree li::before {
      border-top: 1px solid #999;
      top: 10px;
      width: 10px;
      height: 0;
    }    
    
    /* vertical line on list items */
    .tree li:after {
      border-left: 1px solid #999;
      height: 100%;
      width: 0px;
      top: -10px;
    }
    
    /* lower line on list items from the first level because they don't have parents */
    .tree>li::after {
      top: 10px;
    }
    
    /* hide line from the last of the first level list items */
    .tree>li:last-child::after {
      display: none;
    }

    .tree>li:first-child::before {
      display: none;
    }
    
    .tree ul:last-child li:last-child:after {
      height: 20px;
    }

    span, .material-icons {
			vertical-align: middle;
		}

		.material-icons {
			font-size: 14px;
			cursor: pointer;
		}
  `]
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
      if (node.Children.length === 0 && node.HasChildren) {
        this.onExpand.emit(node);
      }
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
