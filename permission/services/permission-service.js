const log4js = require('log4js');
const logger = log4js.getLogger('serviceLogger');
const Promise = require('bluebird');
const storageService = require('./storage');
const permissionDao = require('./dao/permission');

const checkPermission = function(userId, permission) {
    return permissionDao.selectData(userId).then((records) => {
        if (records.length === 0) {
            return false;
        }
        let data = records[0];
        let userPermission = JSON.parse(data['permissions']);
        return userPermission.includes(permission);
    }).catch(err => {
        logger.error(`check permission failed.err:[${err.message}]`);
        throw err;
    });
};

const addUserPermission = function(userId, permissions, operator) {
    let permissionsString = JSON.stringify(permissions);
    return permissionDao.addUserPermission(userId, permissionsString, operator).then((result) => {
        return result;
    }).catch(err => {
        logger.error(`add user permission failed.err:[${err.message}]`);
        throw err;
    });
};

const getUserPermission = function(userId) {
    return permissionDao.selectData(userId).then((records) => {
        if (records.length === 0) {
            return null;
        }
        let data = records[0];
        let permissions = JSON.parse(data['permissions']);
        return { userId, permissions };
    }).catch(err => {
        logger.error(`get user permission failed.err:[${err.message}]`);
        throw err;
    });
};

const deleteUserPermission = function(userId, operator) {
    return permissionDao.deleteUserPermission(userId, operator).then((records) => {
        if (records.length === 0) {
            return null;
        }
        return { userId };
    }).catch(err => {
        logger.error(`delete user permission failed.err:[${err.message}]`);
        throw err;
    });
};

const bulkUpdatePermissions = function(users, operator) {

    return Promise.map(users, (item, index, arrayLength) => {
        let { userId, permissions } = item;
        let permissionsString = JSON.stringify(permissions);
        return permissionDao.updateUserPermission(userId, permissionsString, operator);
    }, { concurrency: 1 }).then((results) => {
        return true;
    }).catch(err => {
        logger.error(`bulk update permission failed.err:[${err.message}]`);
        throw err;
    });
};
module.exports = { checkPermission, addUserPermission, getUserPermission, deleteUserPermission, bulkUpdatePermissions };