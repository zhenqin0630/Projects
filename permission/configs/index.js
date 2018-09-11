'use strict';

const configs = {
    NAME: 'permission service',
    logAppenders: require('./log-appenders'),
    storage: require('./storage')(process.env['STORAGE_CONFIG']),
};

module.exports = configs;