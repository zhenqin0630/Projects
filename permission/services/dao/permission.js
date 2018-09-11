/**
 * permission
 */
'use strict';

const Sequelize = require('sequelize');
const storageService = require('../storage');
const log4js = require('log4js');
const logger = log4js.getLogger('bizDao');

const T_PERMISSION = "t_permission";

let sequelize = storageService.connect();
const T_PERMISSION_MODEL = sequelize.define(T_PERMISSION, {
    userId: { type: Sequelize.STRING, primaryKey: true },
    permissions: { type: Sequelize.STRING, },
    operator: { type: Sequelize.STRING },
}, {
    freezeTableName: true,
    //timestamps: false
});

const init = function() {
    return T_PERMISSION_MODEL.sync({ force: true });
};

const selectData = function(userId) {
    let query = { where: { userId } };
    return T_PERMISSION_MODEL.findAll(query).catch(function(err) {
        logger.error(`select data failed [t_permission].err:[${err.message}]`);
        throw err;
    });
};

const addUserPermission = function(userId, permissions, operator) {
    let data = { userId, permissions, operator };
    return T_PERMISSION_MODEL.create(data).catch(function(err) {
        logger.error(`create data failed [t_permission].err:[${err.message}]`);
        throw err;
    });
};

const deleteUserPermission = function(userId, operator) {
    let data = { where: { userId } };
    return T_PERMISSION_MODEL.destroy(data).catch(function(err) {
        logger.error(`delete data failed [t_permission].err:[${err.message}]`);
        throw err;
    });
};

const updateUserPermission = function(userId, permissions, operator) {
    let data = { userId, permissions, operator };
    let query = { where: { userId } };
    return T_PERMISSION_MODEL.findAll(query).then(records => {
        if (records.length > 0) {
            return T_PERMISSION_MODEL.update(data, query);
        } else {
            return addUserPermission(userId, permissions, operator);
        }
    }).catch(function(err) {
        logger.error(`delete data failed [t_permission].err:[${err.message}]`);
        throw err;
    });
};

module.exports = { init, selectData, addUserPermission, addUserPermission, deleteUserPermission, updateUserPermission };