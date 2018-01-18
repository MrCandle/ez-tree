import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree/tree.component';
import { NodeComponent } from './node/node.component';
import { TreeService } from './services/tree.service';
import { Node } from './model/model';
import { SetFocusDirective } from './set-focus.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [TreeComponent, NodeComponent, SetFocusDirective],
	exports: [TreeComponent, NodeComponent],
	providers: [TreeService]
})
export class EzTreeModule { }
