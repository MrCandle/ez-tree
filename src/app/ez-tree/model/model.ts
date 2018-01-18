export class Node {
    Id: number;
    Name: string;
		Children: Node[];
		IsExpanded: boolean;
		HasChildren: boolean;
		Parent: Node;
		HasFocus: boolean;

		constructor();
		constructor(node?: any){
			this.Id = node && node.Id || 0;
			this.Name = node && node.Name || '';
			this.Children = node && node.Children || [];
			this.HasChildren = node && node.HasChildren || false;
			this.Parent = node && node.Parent || {};
			this.IsExpanded = node && node.IsExpanded || false;
			this.HasFocus = node && node.HasFocus || false;
		}

}
