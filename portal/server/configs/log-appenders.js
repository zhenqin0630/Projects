'use strict';

const configs = {
    appenders: {
        default: { type: 'console' },
        http: { type: 'console' },
        service: { type: 'console' },
        dao: { type: 'console' },
    },
    categories: {
        default: { appenders: ['default'], level: 'error' },
        httpLogger: { appenders: ['http'], level: 'info' },
        service: { appenders: ['service'], level: 'debug' },
        dao: { appenders: ['dao'], level: 'debug' },
    }
};

module.exports = configs;