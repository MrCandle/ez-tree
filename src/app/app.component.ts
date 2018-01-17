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
			Children: [{
				Id: 2,
				Name: 'Oranges',
				HasChildren: false,
				Children: []
			},
			{
				Id: 3,
				Name: 'Pineapples',
				HasChildren: false,
				Children: []
			}, {
				Id: 4,
				Name: 'Apples',
				HasChildren: true,
				Children: [{
					Id: 7,
					Name: 'Papa',
					HasChildren: true,
					Children: []
				}, {
					Id: 8,
					Name: 'Pedro',
					HasChildren: true,
					Children: [{
						Id: 9,
						Name: 'Rodri',
						HasChildren: true,
						Children: []
					}]
				}]
			}, {
				Id: 5,
				Name: 'Bananas',
				HasChildren: true,
				Children: []
			}, {
				Id: 6,
				Name: 'Pears',
				HasChildren: true,
				Children: []
			}]
		};
	}

	nodeExpanded(node: Node) {
		setTimeout(() => {
			let fakeChildren: Node[] = [{
				Id: 7,
				Name: 'Papa',
				HasChildren: true,
				Children: []
			}, {
				Id: 8,
				Name: 'Pedro',
				HasChildren: true,
				Children: [{
					Id: 9,
					Name: 'Rodri',
					HasChildren: true,
					Children: []
				}]
			}];
			node.Children = fakeChildren;
		}, 3000);
	}
}
