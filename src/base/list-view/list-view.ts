export interface IListViewGroupItem {
  avatar: string,
  name: string
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
