interface LazilyOptions {
    selector?: string;
    loadClass?: string;
    errorClass?: string;
    loadCallback?: () => any;
    errorCallback?: () => any;
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
}: LazilyOptions = {}): LazilyMethods;
