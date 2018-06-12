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

/**
 * `lazily` is a UMD module that exposes a global variable when loaded
 * outside of a module loader environment, so we must declare the global
 * function name here.
 */
export as namespace lazily;

// Specify that the `lazily` function is the exported object from the file
export default lazily;
