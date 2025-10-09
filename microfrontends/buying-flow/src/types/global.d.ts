declare global {
  interface Window {
    System?: {
      import: (module: string) => Promise<any>;
      register: (deps: string[], declare: Function) => void;
      resolve: (id: string) => string;
      [key: string]: any;
    };
  }
}

export {};
