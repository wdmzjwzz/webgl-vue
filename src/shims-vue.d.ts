/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '*.frag' {
  const value: string;

  export default value;
}

declare module '*.vert' {
  const value: string;

  export default value;
}
