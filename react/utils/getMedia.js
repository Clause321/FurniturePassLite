module.exports = function(full_path){
    // with '/' being the first character of the return value
    return '/media' + full_path.slice(full_path.indexOf('/media/') + 6);
};