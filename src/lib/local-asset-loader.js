import {costumeUpload, spriteUpload} from './file-uploader.js';

const fetchLocalAssetBuffer = asset => (
    fetch(asset.rawURL).then(response => {
        if (!response.ok) {
            throw new Error(`Could not load ${asset.fileName}`);
        }
        return response.arrayBuffer();
    })
);

const addLocalSprite = (vm, item) => fetchLocalAssetBuffer(item).then(buffer => (
    new Promise((resolve, reject) => {
        spriteUpload(buffer, item.fileType, item.name, vm.runtime.storage, newSprite => {
            vm.addSprite(newSprite)
                .then(resolve)
                .catch(reject);
        }, reject);
    })
));

const addLocalCostume = (vm, item) => fetchLocalAssetBuffer(item).then(buffer => (
    new Promise((resolve, reject) => {
        costumeUpload(buffer, item.fileType, vm.runtime.storage, vmCostumes => {
            vmCostumes.forEach((costume, i) => {
                costume.name = `${item.name}${i ? i + 1 : ''}`;
            });
            Promise.all(vmCostumes.map(costume => vm.addCostume(costume.md5, costume)))
                .then(resolve)
                .catch(reject);
        }, reject);
    })
));

const addLocalBackdrop = (vm, item) => fetchLocalAssetBuffer(item).then(buffer => (
    new Promise((resolve, reject) => {
        costumeUpload(buffer, item.fileType, vm.runtime.storage, vmCostumes => {
            vmCostumes.forEach((costume, i) => {
                costume.name = `${item.name}${i ? i + 1 : ''}`;
            });
            Promise.all(vmCostumes.map(costume => vm.addBackdrop(costume.md5, costume)))
                .then(resolve)
                .catch(reject);
        }, reject);
    })
));

export {
    addLocalBackdrop,
    addLocalCostume,
    addLocalSprite
};
