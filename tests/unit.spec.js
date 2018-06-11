import lazily from '../src/index';

describe('Public API', () => {
    test('Should include an init, destroy and update method', () => {
        const lazyLoader = lazily();

        expect(lazyLoader).toMatchObject({
            init: expect.any(Function),
            destroy: expect.any(Function),
            update: expect.any(Function)
        });
    });

    test('init should return undefined', () => {
        expect(lazily().init()).toBeUndefined();
    });

    test('destroy should return undefined', () => {
        expect(lazily().destroy()).toBeUndefined();
    });

    test('update should return undefined', () => {
        expect(lazily().update()).toBeUndefined();
    });
});

describe('Error handling', () => {
    const stringOptions = ['selector', 'loadClass', 'errorClass', 'rootId', 'rootMargin'];
    const thresholdTestValues = ['0', {}, true, -1, -0.1, -0.01, 1.1, 1.01];
    const stringTestValues = [10, {}, true, ''];

    stringOptions.forEach(option => {
        test(`${option} should be a string with length > 0`, () => {
            stringTestValues.forEach(value => {
                const lazyLoader = lazily({ [option]: value });
                expect(() => {
                    lazyLoader.init()
                }).toThrowError(`Expected ${option} to be a string with length > 0`);
            });
        });
    });

    test('threshold must be a number between 0 and 1', () => {
        thresholdTestValues.forEach(value => {
            const lazyLoader = lazily({ threshold: value });
            expect(() => {
                lazyLoader.init()
            }).toThrowError('Expected threshold to be a number between 0 and 1');
        });
    });

    test('Correct configuration values should not throw', () => {
        const lazyLoader = lazily({
            selector: '.test-selector',
            loadClass: 'test-load-class',
            rootId: 'test-root-id',
            rootMargin: '10px 20px 30px 40px',
            threshold: 0.5
        });

        expect(() => { lazyLoader.init()}).not.toThrow();
    });
});
