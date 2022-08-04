export var Some

export interface RequestProps {
  api: string
  query?: {
    [key: string]: any
  }
}

declare namespace cats {
  interface Setting {

  }
}

declare namespace cats.children {
  interface smallCats {}
}

declare var foo: number
declare function greeting(props: RequestProps) : void