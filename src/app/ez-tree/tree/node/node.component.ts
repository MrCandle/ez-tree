import { Component, Input } from '@angular/core';
import { Node } from '../../model/model';

@Component({
    selector: 'ez-node',
    templateUrl: './node.component.html'
})
export class NodeComponent {

    @Input() node: Node;

}
