const localProjectPathSegments = ['interview', 'VU'];

const getCurrentPathSegments = locationLike => locationLike.pathname
    .split('/')
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean);

const getEditorBasePath = (locationLike = window.location) => {
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
