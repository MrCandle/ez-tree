import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree/tree.component';
import { NodeComponent } from './tree/node/node.component';


@NgModule({
	imports: [
		CommonModule
	],
	declarations: [TreeComponent, NodeComponent],
	exports: [TreeComponent, NodeComponent]
})
export class EzTreeModule { }
