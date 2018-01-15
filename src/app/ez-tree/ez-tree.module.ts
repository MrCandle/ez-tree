import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeComponent } from './tree/tree.component';
import { TreeService } from './services/tree.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [TreeComponent],
	exports: [TreeComponent],
	providers: [TreeService]
})
export class EzTreeModule { }
