import {getTaskProjectFromPath} from './local-task-projects';

const localProjectPathSegments = ['interview', 'VU', 'M5U6'];

const getCurrentPathSegments = locationLike => locationLike.pathname
    .split('/')
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean);

const getEditorBasePath = (locationLike = window.location) => {
    if (getTaskProjectFromPath()) {
        return '../../../../';
    }

    const pathSegments = getCurrentPathSegments(locationLike);
    const lastPathSegment = pathSegments[pathSegments.length - 1];
    const templatePathSegment = lastPathSegment === 'index.html' ?
        pathSegments[pathSegments.length - 2] :
        lastPathSegment;

    if (localProjectPathSegments.includes(templatePathSegment)) {
        return '../';
    }

    return './';
};

export {
    getEditorBasePath
};
