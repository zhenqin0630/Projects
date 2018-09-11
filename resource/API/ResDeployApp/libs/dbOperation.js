var pg = require('pg');
var conString = require('../config/dbConfig');

var dbOperation = {
    
    dbClient:null,

    dbOpen:function(){
        if(this.dbClient == null) {
           this.dbClient = new pg.Client(conString);
        }
    },

    dbConnect:function(callback) {
        this.dbClient.connect(callback);
    },

    dbQuery:function(sqlStatement, callback){
        var tempDbClient = this.dbClient;

        //succeeded on connection   
        tempDbClient.query(sqlStatement, function(error, results){
            //failed on query
            if(error) {
                tempDbClient = null;
                callback(error, results);
                return;
            }

            callback(error, results);
        });
    },

    dbQueryWithoutCallback:function(sqlStatement){
        var tempDbClient = this.dbClient;

        //succeeded on connection
        tempDbClient.query(sqlStatement, function(error, results){
            //failed on query
            if(error) {
                tempDbClient = null;
            }
        });
    },

    dbClose:function(){
        if(this.dbClient != null) {
            this.dbClient.end();
            this.dbClient = null;
        }
    }
};

module.exports = dbOperation;