const localTaskProjects = process.env.LOCAL_TASK_PROJECTS || [];

const getCurrentPathSegments = () => window.location.pathname
    .split('/')
    .map(segment => decodeURIComponent(segment))
    .filter(Boolean);

const getTaskProjectFromPath = () => {
    const pathSegments = getCurrentPathSegments();
    const normalizedSegments = pathSegments[pathSegments.length - 1] === 'index.html' ?
        pathSegments.slice(0, -1) :
        pathSegments;
    const normalizedPath = normalizedSegments.join('/');

    return localTaskProjects.find(taskProject => taskProject.urlPath === normalizedPath) || null;
};

export {
    getTaskProjectFromPath,
    localTaskProjects
};
