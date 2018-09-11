'use strict';
const path = require('path');
const fs = require('fs');

const ENTITY_ID = process.env['TARGET_ENTITY_ID'] || 'metadata.xml';
const TARGET_SITE = process.env['TARGET_SITE'] || 'test';
const TARGET_SSO = process.env['TARGET_SSO'] || 'w3id.alpha.sso.ibm.com';
const TEST_USER = process.env['TEST_USER'];

const configs = {
    idDevelopment: (process.env['NODE_ENV'] === 'development'),
    testUser: TEST_USER ? JSON.parse(TEST_USER) : require('./test-user'),

    logAppenders: require('./log-appenders'),
    sso: {
        entityId: ENTITY_ID,
        targetSite: TARGET_SITE,
        targetSso: TARGET_SSO,

        spOptions: {
            entity_id: `https://${TARGET_SITE}/${ENTITY_ID}`,
            private_key: fs.readFileSync(path.join(__dirname, `../certs/${TARGET_SITE}/key.pem`)).toString(),
            certificate: fs.readFileSync(path.join(__dirname, `../certs/${TARGET_SITE}/cert.pem`)).toString(),
            assert_endpoint: `https://${TARGET_SITE}/assert`,
            sign_get_request: false,
            allow_unencrypted_assertion: true
        },

        idpOptions: {
            sso_login_url: `https://${TARGET_SSO}/auth/sps/samlidp/saml20/login`,
            sso_logout_url: `https://${TARGET_SSO}/auth/sps/samlidp/saml20/logout`,
            certificates: [fs.readFileSync(path.join(__dirname, `../certs/${TARGET_SSO}.pem`)).toString()]
        },
    },
    storage: require('./storage')(process.env['STORAGE_CONFIG']),
};

module.exports = configs;