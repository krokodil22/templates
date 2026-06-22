const localTaskProjects = process.env.LOCAL_TASK_PROJECTS || [];

const getCurrentPathSegments = () => window.location.pathname
    .split('/')
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean);

const pathEndsWithSegments = (pathSegments, suffixSegments) => {
    if (pathSegments.length < suffixSegments.length) return false;

    const offset = pathSegments.length - suffixSegments.length;
    return suffixSegments.every((segment, index) => pathSegments[offset + index] === segment);
};

const getTaskProjectFromPath = () => {
    if (window.LOCAL_TASK_PROJECT) return window.LOCAL_TASK_PROJECT;

    const pathSegments = getCurrentPathSegments();
    const normalizedSegments = pathSegments[pathSegments.length - 1] === 'index.html' ?
        pathSegments.slice(0, -1) :
        pathSegments;

    return localTaskProjects.find(taskProject => {
        const taskPathSegments = taskProject.urlPath.split('/');
        return pathEndsWithSegments(normalizedSegments, taskPathSegments);
    }) || null;
};

export {
    getTaskProjectFromPath,
    localTaskProjects
};
