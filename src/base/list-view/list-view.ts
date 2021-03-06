export interface IListViewGroupItem {
  id: number,
  avatar?: string,
  name?: string,
  group?: string
}

export interface IListViewGroup {
  title: string,
  items: Array<IListViewGroupItem>
}

export interface ITouch {
  anchorIndex: number,
  y1: number,
  y2: number
}
