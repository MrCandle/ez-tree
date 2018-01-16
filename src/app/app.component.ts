import { Component, OnInit } from '@angular/core';

import { Node } from './ez-tree/model/model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  tree: Node;

  ngOnInit() {
    this.tree = {
      Id: 1,
      Name: 'Fruits',
      HasChildren: true,
      Expanded: true,
      Children: [{
        Id: 2,
        Name: 'Oranges',
        HasChildren: false,
        Expanded: false,
        Children: []
      },
      {
        Id: 3,
        Name: 'Pineapples',
        HasChildren: false,
        Expanded: false,
        Children: []
      }, {
        Id: 4,
        Name: 'Apples',
        HasChildren: true,
        Expanded: false,
        Children: [{
          Id: 7,
          Name: 'Papa',
          HasChildren: true,
          Expanded: false,
          Children: []
        }, {
          Id: 8,
          Name: 'Pedro',
          HasChildren: true,
          Expanded: false,
          Children: [{
            Id: 9,
            Name: 'Rodri',
            HasChildren: true,
            Expanded: false,
            Children: []
          }]
        }]
      }, {
        Id: 5,
        Name: 'Bananas',
        HasChildren: true,
        Expanded: false,
        Children: []
      }, {
        Id: 6,
        Name: 'Pears',
        HasChildren: true,
        Expanded: false,
        Children: []
      }]
    };
  }
}


