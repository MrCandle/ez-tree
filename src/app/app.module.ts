import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { EzTreeModule } from './ez-tree/ez-tree.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
		AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
		HttpModule,

		EzTreeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
