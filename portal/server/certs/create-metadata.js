'use strict';

const path = require('path');
const fs = require('fs');
const saml2 = require('saml2-js');

console.info(`process argvs:[${process.argv}]`);

const configs = require('../configs');
const sp = new saml2.ServiceProvider(configs.sso.spOptions);

let metadata = sp.create_metadata();

let targetFile = path.join(__dirname, process.argv[2], configs.sso.entityId);
fs.writeFileSync(targetFile, metadata, 'utf-8');

console.info(`over.`);