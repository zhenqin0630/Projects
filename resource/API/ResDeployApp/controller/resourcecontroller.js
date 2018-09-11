var dbOpe = require('../libs/dbOperation');
var async = require('async');
var utils = require('../libs/utils');
var fs = require('fs');

var resCtrl = {
    getIndex:function(req, res, next) {
        res.render('index.html');
    },

    getResById:function(req, res){
        //get info from database
        var sqlS = "select distinct t1.uid, t1.uname, t1.noteid, t1.band, t1.pem, t1.pm, t1.project, t1.contacttel, t1.businessunit, t1.onboardtime, " +
                    "t2.techskill, t2.experience, t3.language, t3.experience as langexperience from resMainTable t1  " +
                    "left join techskilltable t2 on t2.uid = t1.uid " +
                    "left join languageskilltable t3 on t3.uid = t1.uid " +
                    "where t1.uid = '" + req.params.id + "'";
        
        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, result){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});
            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //succeed to get data from DB, so close it at first
                    dbOpe.dbClose();
        
                    //deal with the return data
                    if(error) {
                        console.log(error);
                        //if any error occurs, return err page to the client
                        res.json(404, {error:'not found'});
        
                    } else {
                        //if succeeded, arrange the data accroding to the results
                        if(results.rowCount > 0) {
                            var techskillArray = [];
                            var langskillArray = [];
                            for(var i = 0; i < results.rowCount; i++) {
                                if(results.rows[i].techskill != null) {
                                    var techskill = {resource_skill:results.rows[i].techskill, resource_skill_expe:results.rows[i].experience};
                                    techskillArray.push(techskill);
                                }
                                if(results.rows[i].language != null) {
                                    var langskill = {resource_skill:results.rows[i].language, resource_skill_expe:results.rows[i].langexperience};
                                    langskillArray.push(langskill);
                                }
                            }
        
                            var resData = {
                                resource_BU:results.rows[0].businessunit,
                                resource_name:results.rows[0].uname,
                                resource_noteid:results.rows[0].noteid,
                                resource_manager:results.rows[0].pem,
                                contact_tel:results.rows[0].contacttel,
                                resource_band:results.rows[0].band,
                                resource_skill:techskillArray,
                                resource_language:langskillArray,
                                resource_availdate:results.rows[0].onboardtime,
                                resource_current_Project:results.rows[0].project,
                                resource_current_ProjectManager:results.rows[0].pm
                            };
        
                            res.json(200, {message_cd:'success', result_cd:'200', res_data:resData});
        
                        } else {
                            //no resource
                            res.json(200, {message_cd:'success', result_cd:'200', res_data:null});
                        }
                    }
                });        
            }
        });
    },

    delResById:function(req, res){
        var sqlS = "delete from resmaintable where uid = '" + req.params.id + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            dbOpe.dbQuery(sqlS, function(error, results){
                //deal with the return data
                if(error) {
                    dbOpe.dbClose();
                    res.json(404, {error:'not found'});
    
                } else {
                    //delete data from techskilltable
                    sqlS = "delete from techskilltable where uid = '" + req.params.id + "'";
                    dbOpe.dbQueryWithoutCallback(sqlS);
    
                    //delete data from languageskilltable
                    sqlS = "delete from languageskilltable where uid = '" + req.params.id + "'";
                    dbOpe.dbQueryWithoutCallback(sqlS);
            
                    //db close
                    dbOpe.dbClose();
    
                    //if succeeded, arrange the data accroding to the results
                    res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                }
            });    
        });
    },

    getResByPem:function(req, res){
        //get info from database
        var sqlS = "select distinct uid, uname, noteid, band, pem, pm, project, contacttel, businessunit, onboardtime from resMainTable " +
                    "where pem = '" + req.params.pem + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, result){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});

            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //deal with the return data
                    if(error) {
                        //if any error occurs, return err page to the client
                        dbOpe.dbClose();
                        res.json(404, {error:'not found'});
        
                    } else {
                        //if succeeded, arrange the data accroding to the results
                        if(results.rowCount > 0) {
                            //get data from techskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct uid, techskill, experience from techskilltable " +
                                        "where uid = '" + item.uid + "'";
                                        
                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_skill = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                            });
        
                            //get data from languageskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct language, experience from languageskilltable " +
                                        "where uid = '" + item.uid + "'";
                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_language = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                                //db close
                                dbOpe.dbClose();

                                if(error) {
                                    res.json(404, {error:'not found'});

                                } else {
                                //from here we have already got all of the data ,so we can organize the json string
                                var resDataArray = utils.makeJson(results, false);
                                //render
                                res.json(200, {message_cd:'success', result_cd:'200', res_data:resDataArray});
                                }
                            });
                        } else {
                            //no resource
                            res.json(200, {message_cd:'success', result_cd:'200', res_data:null});
                        }
                    }
                });
            }
        });
    },

    delResByPem:function(req, res){
        //get info from 
        var sqlS = "select distinct uid from resMainTable where pem = '" + req.params.pem + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});

            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //deal with the return data
                    if(error) {
                        dbOpe.dbClose();
                        res.json(404, {error:'not found'});
        
                    } else {
                        if(results.rowCount > 0) {
                            var inStr = "";
                            for(var i = 0; i < results.rowCount; i++) {
                                inStr += "'" + results.rows[i].uid + "',";
                            }
                            inStr = inStr.substring(0, instr.length - 1);
    
                            //delete data from techskilltable
                            sqlS = "delete from techskilltable where uid in (" + inStr + ")";
                            dbOpe.dbQueryWithoutCallback(sqlS);
            
                            //delete data from languageskilltable
                            sqlS = "delete from languageskilltable where uid in (" + inStr + ")";
                            dbOpe.dbQueryWithoutCallback(sqlS);
    
                            sqlS = "delete from resMainTable where uid in (" + inStr + ")";
                            dbOpe.dbQuery(sqlS, function(error, results){
                                dbOpe.dbClose();
                                if(error) {
                                    //error
                                    res.json(404, {error:'not found'});
                                } else {
                                    //if succeeded, arrange the data accroding to the results
                                    res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                                }
                            });
                        } else {
                            //no
                            dbOpe.dbClose();
                            res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                        } 
                    }
                });    
            }
        });
    },

    getResByProject:function(req, res){
        //get info from database
        var sqlS = "select distinct uid, uname, noteid, band, pem, pm, project, contacttel, businessunit, onboardtime from resMainTable " +
                    "where project = '" + req.params.project + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});

            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //deal with the return data
                    if(error) {
                        //if any error occurs, return err page to the client
                        dbOpe.dbClose();
                        res.json(404, {error:'not found'});
        
                    } else {
                        //if succeeded, arrange the data accroding to the results
                        if(results.rowCount > 0) {
                            //get data from techskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct uid, techskill, experience from techskilltable " +
                                        "where uid = '" + item.uid + "'";
                                        
                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_skill = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                            });
        
                            //get data from languageskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct language, experience from languageskilltable " +
                                        "where uid = '" + item.uid + "'";
                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_language = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                                dbOpe.dbClose();
                                //from here we have already got all of the data ,so we can organize the json string
                                var resDataArray = utils.makeJson(results, false);
                                //json
                                res.json(200, {message_cd:'success', result_cd:'200', res_data:resDataArray});
                            });
        
                        } else {
                            //no resource
                            dbOpe.dbClose();
                            res.json(200, {message_cd:'success', result_cd:'200', res_data:null});
                        }
                    }
                });        
            }
        });
    },

    delResByProject:function(req, res){
        //get info from 
        var sqlS = "select distinct uid from resMainTable where project = '" + req.params.project + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});

            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //deal with the return data
                    if(error) {
                        dbOpe.dbClose();
                        res.json(404, {error:'not found'});
        
                    } else {
                        if(results.rowCount > 0) {
                            var inStr = "";
                            for(var i = 0; i < results.rowCount; i++) {
                                inStr += "'" + results.rows[i].uid + "',";
                            }
                            inStr = inStr.substring(0, instr.length - 1);
    
                            //delete data from techskilltable
                            sqlS = "delete from techskilltable where uid in (" + inStr + ")";
                            dbOpe.dbQueryWithoutCallback(sqlS);
            
                            //delete data from languageskilltable
                            sqlS = "delete from languageskilltable where uid in (" + inStr + ")";
                            dbOpe.dbQueryWithoutCallback(sqlS);
    
                            sqlS = "delete from resMainTable where uid in (" + inStr + ")";
                            dbOpe.dbQuery(sqlS, function(error, results){
                                dbOpe.dbClose();
                                if(error) {
                                    //error
                                    res.json(404, {error:'not found'});
                                } else {
                                    //if succeeded, arrange the data accroding to the results
                                    res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                                }
                            });
                        } else {
                            //no
                            dbOpe.dbClose();
                            res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                        } 
                    }
                });        
            }
        });
    },

    getResByCondition:function(req, res) {
        //get info from database
        var inStr = "";
        for(var i = 0; i < req.body.request_TechSkill.length; i++) {
            inStr += "'" + req.body.request_TechSkill[i] + "',";
        }
        inStr = inStr.substring(0, instr.length - 1);

        var sqlS = "select distinct t1.uid, t1.uname, t1.noteid, t1.band, t1.pem, t1.pm, t1.project, t1.contacttel, t1.businessunit, t1.onboardtime " +
                    "from resMainTable t1 " +
                    "where onboardtime >= '" + req.body.request_month + "' " +
                    "and band >= '" + req.body.request_band_Low + "' " + 
                    "and band <= '" + req.body.request_band_high + "'"; 
        
        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            if(error) {
                //connect error
                dbOpe.dbClose();
                res.json(404, {error:'not found'});
                
            } else {
                dbOpe.dbQuery(sqlS, function(error, results){
                    //deal with the return data
                    if(error) {
                        //if any error occurs, return err page to the client
                        dbOpe.dbClose();
                        res.json(404, {error:'not found'});
        
                    } else {
                        //if succeeded, arrange the data accroding to the results
                        if(results.rowCount > 0) {
                            //get data from techskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct techskill, experience from techskilltable " +
                                        "where uid = '" + item.uid + "' and techskill in (" + inStr + ")";

                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_skill = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                            });
        
                            //get data from languageskilltable
                            async.map(results.rows, function(item, callback){
                                sqlS = "select distinct language, experience from languageskilltable " +
                                        "where uid = '" + item.uid + "' and language = '" + req.body.request_language + "'";

                                dbOpe.dbQuery(sqlS, function(error, results){
                                    //deal with the return data
                                    if(error) {
                                        //nothing
                                    } else {
                                        //deal with data from techskilltable
                                        item.resource_language = results;
                                        callback(null, item);
                                    }
                                });
                            }, function(error, results){
                                if(error) {
                                    dbOpe.dbClose();
                                    res.json(404, {error:'not found'});

                                } else {
                                    var resDataArray = utils.makeJson(results, true);
                                    //render
                                    res.json(200, {message_cd:'success', result_cd:'200', res_data:resDataArray});    
                                }
                            });
                        } else {
                            //no resource
                            dbOpe.dbClose();
                            res.json(200, {message_cd:'success', result_cd:'200', res_data:null});
                        }
                    }
                });
            }            
        });
    },

    addRes:function(req, res){        
        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, result){
            if(error) {
                //connect error
                res.json(404, {error:'insert error'});
            } else {
                async.parallel([
                    function(callback) {
                        //insert data to resMainTable
                        var sqlS = "insert into resmaintable(uid, project, pem, band, workperiod, status, travelflag, traveltime, onboardtime, worklocation, parttimeflag, businessunit, contacttel, pm, uname, noteid) " +
                                    "values ('" + req.body.uid + "', " + 
                                    "'" + req.body.project + "', " +
                                    "'" + req.body.pem + "', " +
                                    "'" + req.body.band + "', " +
                                    "'" + req.body.workperiod + "', " +
                                    "'" + req.body.status + "', " +
                                    "'" + req.body.travelflag + "', " +
                                    "'" + req.body.traveltime + "', " +
                                    "'" + req.body.onboardtime + "', " +
                                    "'" + req.body.worklocation + "', " +
                                    "'" + req.body.parttimeflag + "', " +
                                    "'" + req.body.businessunit + "', " +
                                    "'" + req.body.contacttel + "', " +
                                    "'" + req.body.pm + "', " +
                                    "'" + req.body.uname + "', " +
                                    "'" + req.body.noteid + "')";

                        dbOpe.dbQuery(sqlS, function(error, results){
                            //deal with the return data
                            if(error) {
                                //nothing
                            } else {
                                //deal with data from techskilltable
                                callback(null);
                            }
                        });
                    },
                    function(callback) {
                        //insert data to techskill table
                        var sqlS = "";
                        for(var i = 0; i < req.body.techSkills.length; i++) {
                            sqlS = "insert into techskilltable(uid, techskill, experience) " +
                                    "values('" + req.body.uid + "', " + 
                                    "'" + req.body.techSkills[i].techskill + "', " +
                                    "'" + req.body.techSkills[i].experience + "')";
                            dbOpe.dbQuery(sqlS, function(error, results){
                                //deal with the return data
                                if(error) {
                                    //nothing
                                } else {
                                    //deal with data from techskilltable
                                    callback(null);
                                }
                            });                                        
                        }
                    },
                    function(callback) {
                        //insert data to languageskilltable table
                        var sqlS = "";
                        for(var i = 0; i < req.body.languageskills.length; i++) {
                            sqlS = "insert into languageskilltable(uid, language, experience) " +
                                    "values('" + req.body.uid + "', " + 
                                    "'" + req.body.languageskills[i].language + "', " +
                                    "'" + req.body.languageskills[i].experience + "')";
                            dbOpe.dbQuery(sqlS, function(error, results){
                                //deal with the return data
                                if(error) {
                                    //nothing
                                } else {
                                    //deal with data from techskilltable
                                    callback(null);
                                }
                            });                                        
                        }
                    }, function(error, results) {
                        dbOpe.dbClose();
                        if(error) {
                            res.json(404, {error:'not found'});
                        } else {
                            // res.json(200, {message_cd:'success', result_cd:'200', add_data:results.rowCount});
                            res.json(200, {message_cd:'success', result_cd:'200', add_data:0});
                        }
                    }
                ]);
            }
        });
    },

    updateRes:function(req, res){
        var sqlS = "update resmaintable " +
                    "set project = '" + req.body.project + "', " +
                    "pem = '" + req.body.pem + "', " + 
                    "band = '" + req.body.band + "', " +
                    "workperiod = '" + req.body.workperiod + "', " +
                    "status = '" + req.body.status + "', " +
                    "travelflag = '" + req.body.travelflag + "', " +
                    "traveltime = '" + req.body.traveltime + "', " +
                    "onboardtime = '" + req.body.onboardtime + "', " +
                    "worklocation = '" + req.body.worklocation + "', " +
                    "parttimeflag = '" + req.body.parttimeflag + "', " +
                    "businessunit = '" + req.body.businessunit + "', " +
                    "contacttel = '" + req.body.contacttel + "', " +
                    "pm = '" + req.body.pm + "', " +
                    "uname = '" + req.body.uname + "', " +
                    "noteid = '" + req.body.noteid + "' " + 
                    "where uid = '" + req.body.uid + "'";

        dbOpe.dbOpen();
        dbOpe.dbConnect(function(error, results){
            dbOpe.dbQuery(sqlS, function(error, results){
                //deal with the return data
                if(error) {
                    dbOpe.dbClose();
                    res.json(404, {error:'not found'});
    
                } else {
                    //delete data from techskilltable
                    sqlS = "delete from techskilltable where uid = '" + req.body.uid + "'";
                    dbOpe.dbQuery(sqlS, function(error, results){
                        if(error) {
                            dbOpe.dbClose();
                        } else {
                            //insert the new data to the table
                            var sqlS = "";
                            for(var i = 0; i < req.body.techSkills.length; i++) {
                                sqlS = "insert into techskilltable(uid, techskill, experience) " +
                                        "values('" + req.body.uid + "', " + 
                                        "'" + req.body.techSkills[i].techskill + "', " +
                                        "'" + req.body.techSkills[i].experience + "')";
                                dbOpe.dbQuery(sqlS, function(error, results){});           
                            }    
                        }
                    });
    
                    //delete data from languageskilltable
                    sqlS = "delete from languageskilltable where uid = '" + req.body.uid + "'";
                    dbOpe.dbQuery(sqlS, function(error, results){
                        if(error) {
                            dbOpe.dbClose();
                        } else {
                            //insert data to languageskilltable table
                            var sqlS = "";
                            for(var i = 0; i < req.body.languageskills.length; i++) {
                                sqlS = "insert into languageskilltable(uid, language, experience) " +
                                        "values('" + req.body.uid + "', " + 
                                        "'" + req.body.languageskills[i].language + "', " +
                                        "'" + req.body.languageskills[i].experience + "')";
                                dbOpe.dbQuery(sqlS, function(error, results){});                                        
                            }
                        }
                    });
    
                    //if succeeded, arrange the data accroding to the results
                    res.json(200, {message_cd:'success', result_cd:'200', del_data:results.rowCount});
                }
            });    
        });
    }
};

module.exports = resCtrl;