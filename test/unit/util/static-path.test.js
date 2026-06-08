import {getEditorBasePath} from '../../../src/lib/static-path';

describe('getEditorBasePath', () => {
    test('uses local static assets beside the root editor page', () => {
        expect(getEditorBasePath({pathname: '/templates/'})).toBe('./');
        expect(getEditorBasePath({pathname: '/templates/index.html'})).toBe('./');
    });

    test('uses parent static assets from local project pages', () => {
        expect(getEditorBasePath({pathname: '/templates/VU/'})).toBe('../');
        expect(getEditorBasePath({pathname: '/templates/VU/index.html'})).toBe('../');
        expect(getEditorBasePath({pathname: '/templates/interview/'})).toBe('../');
        expect(getEditorBasePath({pathname: '/templates/interview/index.html'})).toBe('../');
        expect(getEditorBasePath({pathname: '/templates/M5U6/'})).toBe('../');
        expect(getEditorBasePath({pathname: '/templates/M5U6/index.html'})).toBe('../');
    });
});
