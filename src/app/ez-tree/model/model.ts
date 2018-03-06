import { TemplateRef } from '@angular/core';

export class Node {
	Id: number;
	Name: string;
	Children: Node[] = [];
	IsExpanded: boolean = false;
	isDisabled: boolean = false;
	HasChildren: boolean = false;
	Parent: Node;
	HasFocus: boolean = false;
	ChildIndex: number = 0;
	IsSelected: boolean = false;
	IsLastChild: boolean = false;
	Options: any = {};
	Level: number;

	constructor(node?: any) {
		this.Id = node && node.Id || 0;
		this.Name = node && node.Name || '';
		this.Children = node && node.Children || [];
		this.HasChildren = node && node.HasChildren || false;
		this.Parent = node && node.Parent || {};
		this.IsExpanded = node && node.IsExpanded || false;
		this.isDisabled = node && node.isDisabled && false;
		this.HasFocus = node && node.HasFocus || false;
		this.ChildIndex = node && node.ChildIndex || 0;
		this.IsSelected = node && node.IsSelected || false;
		this.IsLastChild = node && node.IsLastChild || false;
		this.Level = node && node.Parent && node.Parent.Level + 1 || 0;
	}
}

export class Templates {
	[key: string]: TemplateRef<any>;
}
