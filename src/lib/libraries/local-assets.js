const spriteAssets = require.context('../../../static/sprites', false, /\.(bmp|gif|jpe?g|png|svg)$/i);
const backdropAssets = require.context('../../../static/backs', false, /\.(bmp|gif|jpe?g|png|svg)$/i);

const imageTypeForFile = fileName => {
    const extension = fileName.split('.')
        .pop()
        .toLowerCase();
    switch (extension) {
    case 'jpg':
    case 'jpeg':
        return 'image/jpeg';
    case 'svg':
        return 'image/svg+xml';
    case 'gif':
        return 'image/gif';
    case 'bmp':
        return 'image/bmp';
    case 'png':
    default:
        return 'image/png';
    }
};

const assetNameForFile = fileName => fileName.replace(/\.[^.]+$/, '');

const makeImageLibraryItem = fileName => rawURL => ({
    name: assetNameForFile(fileName),
    rawURL,
    fileName,
    fileType: imageTypeForFile(fileName),
    tags: ['local']
});

const resolveAssetURL = asset => (asset && asset.default ? asset.default : asset);

const makeImageLibraryContent = (assetContext, assetFactory) => assetContext.keys()
    .sort((first, second) => first.localeCompare(second, 'en', {
        numeric: true,
        sensitivity: 'base'
    }))
    .map(assetPath => {
        const fileName = assetPath.replace(/^\.\//, '');
        return assetFactory(fileName)(resolveAssetURL(assetContext(assetPath)));
    });

const spriteAsset = makeImageLibraryItem;
const backdropAsset = makeImageLibraryItem;
const costumeAsset = makeImageLibraryItem;

const spriteLibraryContent = makeImageLibraryContent(spriteAssets, spriteAsset);
const backdropLibraryContent = makeImageLibraryContent(backdropAssets, backdropAsset);
const costumeLibraryContent = makeImageLibraryContent(spriteAssets, costumeAsset);

export {
    backdropLibraryContent,
    costumeLibraryContent,
    spriteLibraryContent
};
