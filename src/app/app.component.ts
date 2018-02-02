import { Component, OnInit, ViewChild } from '@angular/core';

// import { Node } from 'ez-tree';
import { Node } from './ez-tree/model/model';
import { TreeComponent } from './ez-tree/tree/tree.component';


@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
	tree: Node;
	nodeSelect: Node = new Node();
	@ViewChild('treeComponent') treeComponent: TreeComponent;

	ngOnInit() {
		this.tree = {
			Id: 1,
			Name: 'Fruits',
			isDisabled: false,
			HasChildren: true,
			Children: [{
				Id: 2,
				Name: 'Oranges',
				isDisabled: false,
				HasChildren: false,
				Children: []
			},
			{
				Id: 3,
				Name: 'Pineapples',
				isDisabled: false,
				HasChildren: false,
				Children: []
			}, {
				Id: 4,
				Name: 'Apples',
				isDisabled: false,
				HasChildren: true,
				Children: [{
					Id: 7,
					Name: 'Papa',
					isDisabled: false,
					HasChildren: true,
					Children: []
				}, {
					Id: 8,
					Name: 'Pedro',
					HasChildren: true,
					Children: [{
						Id: 9,
						Name: 'Rodri',
						isDisabled: false,
						HasChildren: true,
						Children: []
					}]
				}]
			}, {
				Id: 5,
				Name: 'Bananas',
				HasChildren: true,
				isDisabled: false,
				Children: []
			}, {
				Id: 6,
				Name: 'Pears (disabled)',
				HasChildren: true,
				isDisabled: true,
				Children: []
			}]
		};
	}

	nodeExpanded(node: Node) {
		setTimeout(() => {
			let fakeChildren: Node[] = [{
				Id: 7,
				Name: 'Anda el lazy load?',
				HasChildren: true,
				IsSelected: true,
				Children: []
			}, {
				Id: 8,
				Name: 'Anda el lazy load?',
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

	nodeSelected(node: Node) {
		setTimeout(() =>
			this.nodeSelect = node, 0);
	}

	selectNodeById() {
		this.treeComponent.getControllerByNodeId(3).select();
	}
}
