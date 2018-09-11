'use strict';

const configs = require('./configs');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const saml2 = require('saml2-js');

var index = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cookieSession({ secret: 'tobo!', cookie: { maxAge: -1 } }));

// Create service provider
const sp = new saml2.ServiceProvider(configs.sso.spOptions);

// Create identity provider
const idp = new saml2.IdentityProvider(configs.sso.idpOptions);

const samlRequests = [];

// Endpoint to retrieve metadata
app.get("/metadata.xml", function(req, res) {
    res.type('application/xml');
    res.send(sp.create_metadata());
});

app.all('/*', function(req, res, next) {
    if (req.url === "/logout" || (req.url === "/assert" && req.method === "POST") || req.url === "/metadata.xml") {
        console.log("Hit Correct Filter.");
        next();
    } else {
        //development
        if (configs.idDevelopment && configs.testUser) {
            req.session.userId = configs.testUser.userId;
            req.session.userFirstName = configs.testUser.userFirstName;
            req.session.userLastName = configs.testUser.userLastName;
            req.session.userDisplayName = configs.testUser.userDisplayName;
            req.session.userCNum = configs.testUser.userCNum;
            req.session.sessionIndex = configs.testUser.sessionIndex;
        }

        console.info(`req.session=[${JSON.stringify(req.session||{})}]`);
        let userId = req.session.userId;
        if (!userId) {
            // {relay_state: req.url} can be used as the second parameter to keep track of request url.
            // req.url value will be ralayed back in SAML reesponse and can be accessed using req.body.RelayState.
            sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
                if (err) {
                    return res.sendStatus(500);
                }

                samlRequests[request_id] = req.url;
                res.redirect(login_url);
            });
        } else {
            // Simply print information of logged in user.
            //

            // Or continue with the requested endpoint
            next();
        }
    }
});

app.post("/assert", function(req, res) {
    var options = { request_body: req.body };
    sp.post_assert(idp, options, function(err, saml_response) {
        console.log(`Entered Assert.saml_response=[${JSON.stringify(saml_response)}]`);
        if (err) {
            return res.sendStatus(500);
        }
        var requestId = saml_response.response_header.in_response_to;
        var reqUrl = samlRequests[requestId];
        console.info(`requestId=[${requestId}]`);
        console.info(`samlRequests=${JSON.stringify(samlRequests)}`);
        console.info(`reqUrl=[${reqUrl}]`);
        if (reqUrl) {
            req.session.userId = saml_response.user.name_id;
            req.session.userFirstName = saml_response.user.attributes.firstName;
            req.session.userLastName = saml_response.user.attributes.lastName;
            req.session.userDisplayName = saml_response.user.attributes.cn;
            req.session.userCNum = saml_response.user.attributes.uid;
            req.session.sessionIndex = saml_response.user.session_index;
            req.session.save();

            delete samlRequests[requestId];

            res.redirect(reqUrl);
        } else {
            res.sendStatus(406);
        }
    });
});

app.get("/logout", function(req, res) {
    req.session = null;
    res.send("Loggout success");
});

app.use(function(req, res, next) {
    if (req.method === 'OPTIONS') {
        var headers = {};
        headers["Access-Control-Allow-Origin"] = "*";
        headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
        headers["Access-Control-Allow-Credentials"] = false;
        headers["Access-Control-Max-Age"] = '86400'; // 24 hours
        headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
        res.writeHead(200, headers);
        res.end();
    } else {
        res.header("Access-Control-Allow-Origin", "*");
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        next();
    }
});

app.disable('etag');
app.use(express.static(__dirname + '/public'));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;