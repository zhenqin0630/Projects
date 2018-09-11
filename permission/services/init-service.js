'use strict';
const storageService = require('./storage');
const init = function() {
    return Promise.resolve().then(() => {
        return storageService.init();
    }).then(() => {
        const permissionDao = require('./dao/permission');
        return permissionDao.init();
    });
};

module.exports = { init };