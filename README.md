# Lazily.js

A lightweight (1.8kB min, 950b min + gzip) image lazy-loading utility using the [Intersection Observer API](https://developer.mozillaorg/en-US/docs/Web/API/Intersection_Observer_API).

## Browser Support

For Intersection Observer API support please refer to [canIuse](https://caniuse.com/#feat=intersectionobserver). In unsupporting browsers it's necessary to load a [polyfill](https://github.com/w3c/IntersectionObserver/tree/master/polyfill) in order to observe images on scroll. In the absence of native or polyfilled support, all images are loaded immediately.

## Install

Install with [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/):

npm:
```
npm install lazily --save
```

yarn:
```
yarn add lazily
```

## Example Usage

```html
<!-- Simple image -->
<img
    class="js-lazily-image"
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    data-src="my-image.jpg"
    alt="Example alt text"
>

<!-- Responsive image -->
<img
    class="js-lazily-image"
    alt="Example alt text"
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    sizes="(max-width: 460px) 100vw,
           (max-width: 1024px) 100vw,
           (min-width: 1025px) 1200px"
    data-src="my-image.png"
    data-srcset="my-image--mobile.jpg 460w,
                 my-image--tablet.jpg 768w,
                 my-image--desktop.jpg 1600w"
>

<!-- Picture -->
<picture>
    <source
        class="js-lazily-image"
        srcset="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        data-srcset="my-image--large.jpg"
        media="(min-width: 1200px)"
    >
    <img
        class="js-lazily-image"
        src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        data-src="my-image--default.jpg"
        alt="MDN"
    >
</picture>
```

```JavaScript
import lazily from 'lazily.js';

/**
 * Call the `lazily` factory function to return a `lazily`
 * object exposing three methods:
 *
 * 1. init
 * 2. destroy
 * 3. update
 */
const lazyLoad = lazily();

// 1. Begin watching images on scroll.
lazyLoad.init();

/**
 * 2. Stop watching images on scroll, and destroy the Intersection Observer instance
 * created by calling the `init` method.
 */
lazyLoad.destroy();

/**
 * 3. Teardown the Intersection Observer instance and create a brand new one.
 * This method is useful if you need to respond to DOM insertions after fetching
 * data asynchronously.
 */
fetchImagesAndUpdateDOM().then(() => {
    lazyLoad.update();
});

```

## Configuration

```JavaScript
const lazyLoad = lazily({
    selector: '.my-image-class',
    loadClass: 'my-load-class',
    errorClass: 'my-error-class',
    loadCallback: () => console.log('image has been loaded!'),
    errorCallback: () => console.log('something went wrong!'),
    rootId: 'my-root-container-id',
    rootMargin: '100px 100px 100px 100px',
    threshold: 0.5
});
```

### Options:


| Option  | Type  | Default  | Description
| ------- | ----- | -------- | ------------
| `selector`      | String   |`'.js-lazily-image'`| Selector used to retrieve images. Any valid selector that can be passed to `querySelectorAll` can be used.
| `loadClass`     | String   | `'has-loaded'` | Class to be applied to each image once loaded.
| `errorClass`    | String   | `'has-error'` | Class to be applied to each image on error.
| `loadCallback`  | Function | `null` | Callback function to be executed on each image's `load` event.
| `errorCallback` | Function | `null` | Callback function to be executed on each image's `error` event.
| `rootId`      | String   | `null` | `Id` of the `root` container. Defaults to the browser viewport if not specified. (see Intersection Observer API [docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for details).
| `rootMargin`    | String   | `'0px 0px 0px 0px'` | Margin around the root container. Can have values similar to the CSS margin property. E.g. `"10px 20px 30px 40px"`. If the `rootId` is specified the values can be percentages. (see Intersection Observer API [docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for details).
| `threshold`     | Number   | `0` | A single number which indicates at what percentage of the images's visibility the observer's callback should be executed. E.g. If you want to detect when visibility passes the 50% mark (half of the image is visible within the root element), you can use a value of `0.5`. (see Intersection Observer API [docs](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for details).

## License

Licensed under the MIT License, Copyright © 2018 Reece Lucas.

See [LICENSE](./LICENSE) for more information.