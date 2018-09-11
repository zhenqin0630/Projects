/**
 * RDB関連する操作ユーティリティ
 * @authors dlycliu@cn.ibm.com
 */
'use strict';
const Sequelize = require('sequelize');
const configs = require('../configs');
const log4js = require('log4js');
const logger = log4js.getLogger('transportDao');

const { storage: storageConfig } = configs;

var sequelize = null;

/**
 * 初期化処理メソッド.
 */
const init = function() {

    sequelize = new Sequelize(storageConfig.defult_db, storageConfig.user, storageConfig.password, storageConfig.others);

    return new Promise(function(resolve, reject) {
        resolve(sequelize);
    });
};

/**
 * 接続テストメソッド.
 */
const test = function() {
    sequelize.authenticate().then(() => {
            logger.debug('Connection has been established successfully.');
        })
        .catch(err => {
            logger.debug('Unable to connect to the database:', err);
        });
};

/**
 * 接続インスタンス取得メソッド.
 */
const connect = function() {
    return sequelize;
};

exports.init = init;
exports.test = test;
exports.connect = connect;