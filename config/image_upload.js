var mediaDir = __dirname + '/../media';

// configuration for a blueimp-file-upload-expressjs uploader
// this is a partial config
// uploadDir & uploadUrl must be reconfigured
module.exports = {
    tmpDir: mediaDir + '/tmp',
    uploadDir: mediaDir + '/images', // need to append itemID
    uploadUrl: '/api/uploaded/images', // need to append itemID (& userID)
    copyImgAsThumb: true,
    imageVersions: {
        'large': {
            width: 1500,
            height: 1500
        },
        'small': {
            width: 160,
            height: 160
        }
    },
    storage: {
        type: 'local'
    }
};