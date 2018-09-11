'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('httpLogger');
const permissionService = require('../../services/permission-service');

const checkPermission = function(req, res, next) {
    let { userId, permission } = req.params;

    if (userId === 'data') {
        return next();
    }

    permissionService.checkPermission(userId, permission).then((result) => {
        let code = result ? 0 : 100;
        let message = result ? 'ok' : 'not permission';
        res.send({ code, message });
    }).catch(err => {
        logger.error(`check permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });
};

const addPermission = function(req, res, next) {
    let { userId, permissions, operator } = req.body;
    permissionService.addUserPermission(userId, permissions, operator).then((result) => {
        let code = result ? 0 : 100;
        let message = result ? 'ok' : 'failed';
        res.send({ code, message });
    }).catch(err => {
        logger.error(`cheadd user permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });
};

const bulkUpdatePermissions = function(req, res, next) {
    let { users, operator } = req.body;
    permissionService.bulkUpdatePermissions(users, operator).then((result) => {
        let code = result ? 0 : 100;
        let message = result ? 'ok' : 'failed';
        res.send({ code, message });
    }).catch(err => {
        logger.error(`update user permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });
};

const getPermission = function(req, res, next) {
    let { userId } = req.params;

    permissionService.getUserPermission(userId).then((result) => {
        if (result) {
            let { permissions } = result;
            res.send({
                code: 0,
                message: 'ok',
                value: { userId, permissions }
            });
        } else {
            res.send({
                code: 100,
                message: 'not find user'
            });
        }
    }).catch(err => {
        logger.error(`get user permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });
};

const deletePermission = function(req, res, next) {
    let { userId } = req.params;
    let { operator } = req.body;

    permissionService.deleteUserPermission(userId, operator).then((result) => {
        if (result) {
            res.send({
                code: 0,
                message: 'ok',
                value: { userId }
            });
        } else {
            res.send({
                code: 100,
                message: 'not find user'
            });
        }
    }).catch(err => {
        logger.error(`delete user permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });
};

module.exports = {
    checkPermission,
    addPermission,
    bulkUpdatePermissions,
    getPermission,
    deletePermission
};