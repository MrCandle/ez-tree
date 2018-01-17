import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree/tree.component';
import { NodeComponent } from './node/node.component';
import { TreeService } from './services/tree.service';
import { Node } from './model/model';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [TreeComponent, NodeComponent],
	exports: [TreeComponent, NodeComponent],
	providers: [TreeService]
})
export class EzTreeModule { }
