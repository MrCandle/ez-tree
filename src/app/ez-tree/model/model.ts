export class Node {
    Id: number;
    Name: string;
    Expanded: boolean;
    Children: any[] = [];
    HasChildren: boolean;
}