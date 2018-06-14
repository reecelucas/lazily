/**
 * Exported factory function for creating a new "lazily" object.
 *
 * @typedef {Object} Lazily
 * @property {Function} init - sets up and instantiates an intersection observer.
 * @property {Function} destroy - disconnects the intersection observer instance.
 * @property {Function} update - tears down & reinitialises the intersection observer.
 *
 * @param {object} options – configuration overrides.
 * @param {String} [options.selector='.js-lazy-image'] – selector used to retrieve images.
 * @param {String} [options.loadClass='has-loaded'] – class applied to each image once loaded.
 * @param {String} [options.errorClass='has-error'] – class applied to each image on error.
 * @param {Function} [options.loadCallback=null] – callback function executed on each image load.
 * @param {Function} [options.errorCallback=null] – callback function executed on each image error.
 * @param {String} [options.rootId=null] – ID of root container. When no value is passed the
 * defaults to the browser viewport.
 * @param {String} [options.rootMargin='0px 0px 0px 0px'] – margin around the root
 * (elem or viewport). Can have values similar to the CSS margin property,
 * e.g. "10px 20px 30px 40px" (top, right, bottom, left). If the rootId is specified,
 * the values can be percentages.
 * @param {Number} [options.threshold=0] – a single number which indicates at what percentage
 * of the target's visibility the observer's callback should be executed. E.g. if you only want to
 * detect when visibility passes the 50% mark (half of the element is visible within the
 * root element), you can use a value of 0.5.
 * @returns {Lazily} - The "Lazily" object exposing init, destroy and update methods
 */
export default function lazily({
    selector = '.js-lazily-image',
    loadClass = 'has-loaded',
    errorClass = 'has-error',
    loadCallback,
    errorCallback,
    rootId,
    rootMargin = '0px 0px 0px 0px',
    threshold = 0
} = {}) {
    const d = document;
    let imageArray = [];
    let imageCount;
    let observer;

    /**
     * Disconnect the observer (if it exists), and reset
     * module state to default values.
     *
     * @returns {void}
     * @private
     */
    function resetState() {
        if (!observer) return;

        observer.disconnect();
        observer = null;
        imageArray.length = 0;
        imageCount = 0;
    }

    /**
     * Removes `data-src` and `data-srcset` attributes from img node.
     *
     * @param {HTMLElement} img – reference to <img> node.
     * @returns {void}
     * @private
     */
    function stripDataAttributes(img) {
        if (!img) return;

        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
    }

    /**
     * @param {HTMLElement} img – reference to `<img>` node.
     * @returns {Boolean} - true if img has the `data-src` attribute,
     * which is stripped when the img is loaded.
     * @private
     */
    function hasNotBeenLoaded(img) {
        return img.hasAttribute('data-src') || img.hasAttribute('data-srcset');
    }

    /**
     * @param {String} selector – selector to pass to `querySelectorAll`.
     * @returns {Array} - array of DOM elements matching the passed selector
     * (which have not already been loaded).
     * @private
     */
    function getElementsAsArray(elementSelector) {
        return Array.from(d.querySelectorAll(elementSelector)).filter(hasNotBeenLoaded);
    }

    /**
     * Sets image `src` and `srcset`.
     * Adds `loadClass` and fires `loadCallback` (if provided).
     *
     * @param {HTMLElement} img – reference to <img> node.
     * @param {String} src – img src url.
     * @param {String} srcset – img srcset urls.
     * @returns {void}
     * @private
     */
    function applyImage(img, src, srcset) {
        const image = img;

        if (src) image.src = src;
        if (srcset) image.srcset = srcset;

        stripDataAttributes(image);

        if (!image.classList.contains(loadClass)) {
            image.classList.add(loadClass);
        }

        if (loadCallback && typeof loadCallback === 'function') {
            loadCallback(image);
        }
    }

    /**
     * Adds `errorClass` and fires `errorCallback` (if provided).
     *
     * @param {HTMLElement} img – reference to <img> node.
     * @returns {void}
     * @private
     */
    function handleImageError(img) {
        const image = img;

        // Remove `data-` attributes to prevent multiple attempts at lazy-loading
        stripDataAttributes(image);

        if (!image.classList.contains(errorClass)) {
            image.classList.add(errorClass);
        }

        if (errorCallback && typeof errorCallback === 'function') {
            errorCallback(image);
        }
    }

    /**
     * Fetches the images for the given `src` and `srcset` URLs.
     * Returns a Promise that resolves if the images are successfuly downloaded.
     *
     * @param {String} srcUrl – img `src` URL.
     * @param {String} srcsetUrls – img `srcset` URLs.
     * @returns {Promise} – returns the img `src` and `srcset` URLs when resolved.
     * @private
     */
    function fetchImages(srcUrl, srcsetUrls) {
        return new Promise((resolve, reject) => {
            if (!srcUrl && !srcsetUrls) reject();

            const image = new Image();
            /**
             * Bind load & error handlers before setting image `src` & `srcset`.
             * Return an object as the resolve value since Promises must only
             * return a single fullfilment value.
             */
            image.onload = () =>
                resolve({
                    src: srcUrl,
                    srcset: srcsetUrls
                });

            image.onerror = () => reject();

            if (srcUrl) image.src = srcUrl;
            if (srcsetUrls) image.srcset = srcsetUrls;
        });
    }

    /**
     * Retrieves the `src` and `srcset` URLs for a given image.
     * Calls `fetchImages` and handles image load and error.
     *
     * @param {HTMLElement} img – reference to `<img>` node.
     * @returns {void}
     * @private
     */
    function loadImage(img) {
        const srcUrl = img.getAttribute('data-src');
        const srcsetUrls = img.getAttribute('data-srcset');

        fetchImages(srcUrl, srcsetUrls)
            .then(({ src, srcset }) => applyImage(img, src, srcset))
            .catch(() => handleImageError(img));
    }

    /**
     * @param {Array} entries – list of `IntersectionObserverEntry` objects.
     * @returns {void}
     * @private
     */
    function onEntry(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const image = entry.target;
            imageCount -= 1;

            // Stop watching the image and load it
            observer.unobserve(image);
            loadImage(image);
        });

        /**
         * Disconnect the `observer` and reset module state when all
         * images have been loaded.
         */
        if (imageCount === 0) resetState();
    }

    /**
     * Checks validity of user-provided configuration values.
     *
     * @returns{(void|TypeError)}
     * @private
     */
    function handleConfigErrors() {
        const stringOptionsMap = {
            selector,
            loadClass,
            errorClass,
            rootId,
            rootMargin
        };

        // `keys --> forEach` pairing used in favour of `Object.values` for deeper support
        Object.keys(stringOptionsMap).forEach(option => {
            const optionValue = stringOptionsMap[option];

            if (
                optionValue !== undefined &&
                (typeof optionValue !== 'string' || optionValue.length === 0)
            ) {
                throw new Error(`Expected ${option} to be a string with length > 0`);
            }
        });

        // Threshold value must be a number between 0 and 1
        if (typeof threshold !== 'number' || !(threshold >= 0 && threshold <= 1)) {
            throw new Error('Expected threshold to be a number between 0 and 1');
        }
    }

    /**
     * @param {Array} images – array of DOM elements.
     * @param {IntersectionObserver} observerInstance – `IntersectionObserver` instance.
     * @returns {void}
     * @private
     */
    function observeImages(images, observerInstance) {
        images.forEach(image => observerInstance.observe(image));
    }

    /**
     * Retrieves an array of DOM elements matching the given selector.
     * Creates a new instance of the `IntersectionObserver` (in supporting browsers),
     * to watch each selected element for visibility changes. In unsupporting browsers
     * the images are loaded immediately.
     *
     * @returns {void}
     * @public
     */
    function init() {
        handleConfigErrors();

        imageArray = getElementsAsArray(selector);
        imageCount = imageArray.length;

        if (imageCount === 0) return;

        /**
         * If the browser does not support the Intersection Observer API (and a
         * polyfill has not been included), load all images straight away.
         */
        if (!('IntersectionObserver' in window)) {
            imageArray.forEach(image => loadImage(image));
            return;
        }

        // Instantiate a new `IntersectionObserver`
        observer = new IntersectionObserver(onEntry, {
            root: rootId ? d.getElementById(rootId) : null,
            rootMargin,
            threshold
        });

        observeImages(imageArray, observer);
    }

    /**
     * Updates the array of DOM elements that are observed
     * (matching the selector passed on `init`). Useful for responding
     * to DOM insertions.
     *
     * @returns {void}
     * @public
     */
     function update() {
        if (!observer) return;

        imageArray = getElementsAsArray(selector);
        imageCount = imageArray.length;

        if (imageCount === 0) return;

        observeImages(imageArray, observer);
    }

    /**
     * Stops the `observer` from watching all of its target elements for visibility changes.
     * Empties the `imageArray` of DOM elements & resets the count variable.
     *
     * @returns {void}
     * @public
     */
    function destroy() {
        resetState();
    }

    return {
        init,
        destroy,
        update
    };
}
