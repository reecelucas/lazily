interface LazilyOptions {
    selector?: string;
    loadClass?: string;
    errorClass?: string;
    loadCallback?: (...args: any[]) => any;
    errorCallback?: (...args: any[]) => any;
    rootId?: string;
    rootMargin?: string;
    threshold?: number;
}

interface LazilyMethods {
    init: () => void;
    destroy: () => void;
    update: () => void;
}

declare function lazily({
    selector,
    loadClass,
    errorClass,
    loadCallback,
    errorCallback,
    rootId,
    rootMargin,
    threshold
}?: LazilyOptions): LazilyMethods;

declare namespace lazily { }

// Specify that the `lazily` function is the exported object from the file
declare module 'lazily.js' {
    export = lazily;
}
