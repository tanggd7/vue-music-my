export interface listViewGroupItem {
  avatar: string,
  name: string
}

export interface listViewGroup {
  title: string,
  items: Array<listViewGroupItem>
}
