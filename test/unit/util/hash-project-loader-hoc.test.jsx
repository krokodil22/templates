import React from 'react';
import configureStore from 'redux-mock-store';
import {mount} from 'enzyme';

import HashParserHOC from '../../../src/lib/hash-parser-hoc.jsx';

jest.mock('react-ga');

describe('HashParserHOC', () => {
    const mockStore = configureStore();
    let store;

    beforeEach(() => {
        Object.defineProperty(window.location, 'pathname', {
            value: '/',
            configurable: true
        });
        window.location.hash = '';
        store = mockStore({
            scratchGui: {
                projectState: {}
            }
        });
    });

    test('when there is a hash, it passes the hash as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '#1234567';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('1234567');
    });

    test('when there is no hash, it passes 0 as the projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('0');
    });

    test('when the hash is not a number, it passes 0 as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '#winning';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('0');
    });

    test('when the path is a local interview template, it passes interview as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        Object.defineProperty(window.location, 'pathname', {
            value: '/interview/',
            configurable: true
        });
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('interview');
    });

    test('when the path is a local VU template, it passes VU as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        Object.defineProperty(window.location, 'pathname', {
            value: '/VU/',
            configurable: true
        });
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('VU');
    });

    test('when the path is a local M5U6 template, it passes M5U6 as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        Object.defineProperty(window.location, 'pathname', {
            value: '/M5U6/',
            configurable: true
        });
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('M5U6');
    });

    test('when the file path contains a template folder name outside the page route, it passes 0 as projectId', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        Object.defineProperty(window.location, 'pathname', {
            value: '/home/runner/work/VU/project/build/index.html',
            configurable: true
        });
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        expect(mockSetProjectIdFunc.mock.calls[0][0]).toBe('0');
    });

    test('when hash change happens, the projectId state is changed', () => {
        const Component = ({projectId}) => <div>{projectId}</div>;
        const WrappedComponent = HashParserHOC(Component);
        window.location.hash = '';
        const mockSetProjectIdFunc = jest.fn();
        const mounted = mount(
            <WrappedComponent
                setProjectId={mockSetProjectIdFunc}
                store={store}
            />
        );
        window.location.hash = '#1234567';
        mounted
            .childAt(0)
            .instance()
            .handleHashChange();
        expect(mockSetProjectIdFunc.mock.calls.length).toBe(2);
    });
});
