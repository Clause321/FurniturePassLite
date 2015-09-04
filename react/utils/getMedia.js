module.exports = function(full_path){
    // with '/' being the first character of the return value
    if(full_path === null){
        return null;
    }
    return '/media' + full_path.slice(full_path.indexOf('/media/') + 6);
};