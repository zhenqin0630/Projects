'use strict';

let defaultStorage = {
    type: 'postgres',
    host: '127.0.0.1',
    port: 35432,
    user: 'ms',
    password: 'ms12345678-.',
    defult_db: 'ms',
    pool_max: 5,
    pool_min: 0,
    pool_acquire: 30000,
    pool_idle: 10000
};

const getStorageConfig = function(configValue) {
    let storageConfig = defaultStorage;
    if (configValue) {
        try {
            storageConfig = JSON.parse(configValue);
        } catch (err) {
            //
        }
    }
    let { defult_db, user, password } = storageConfig;
    let othersConfig = {
        host: storageConfig.host,
        port: storageConfig.port,
        dialect: storageConfig.type,
        pool: {
            max: storageConfig.pool_max,
            min: storageConfig.pool_min,
            acquire: storageConfig.pool_acquire,
            idle: storageConfig.pool_idle
        }
    };

    let targetConfig = { defult_db, user, password, others: othersConfig };
    return targetConfig;
};

const configs = getStorageConfig;

module.exports = configs;