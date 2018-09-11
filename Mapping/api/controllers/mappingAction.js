'use strict';
const log4js = require('log4js');
const logger = log4js.getLogger('httpLogger');


const getResourceRecommondation = function(req, res, next) {
  
    //TODO : call resource MicroService to get Mapping Resouce Info
    /*resourceService.getResourceInfo(req.body).then((result) => {
        if (result) {
            let { resourceInfo } = result;
            res.send({
                code: 0,
                message: 'ok',
                value: { userId, resourceInfo }
            });
        } else {
            res.send({
                code: 100,
                message: 'not find user'
            });
        }
    }).catch(err => {
        logger.error(`get  failed.err:[${err.message}]`);
        res.sendStatus(500);
    });*/
    //mock
    res.send({
        code: 200,
        message: 'success get Mapping Resource Info',
        resourceInfo: [		
            {	
                resource_BU: "CIC JP CSU Industry",
                resource_name: "zhang xiao feng",
                resource_noteid: "xiao feng zhang/China/IBM",
                resource_manager: "dian guang han/China/IBM",
                contact: "dian guang han/China/IBM",
                contact_tel: "15998581414",
                resource_band: "7B",
                resource_skill: "java",
                resource_language: "japanese",
                resource_availdate: "20180910",
                resource_current_Project: "共立製薬",
                resource_current_ProjectManager: "Peng DL Lan/China/IBM"
            },	
            {	
                resource_BU: "GCG",
                resource_name: "liu shi feng",
                resource_noteid: "shi feng liu/China/IBM",
                resource_manager: "dong han/China/IBM",
                contact: "dong han/China/IBM",
                contact_tel: "15898001414",
                resource_band: "7B",
                resource_skill: "Cobol",
                resource_language: "japanese",
                resource_availdate: "20180810",
                resource_current_Project: "MSR_RP",
                resource_current_ProjectManager: "XXXXXX/China/IBM"
            }	
        ]		
    });
};


const getDemandRecommondation = function(req, res, next) {
    
    //TODO : call Demond MicroService to get Mapping Demand Info
    /*DemandService.getDemandInfo(req.body).then((result) => {
        if (result) {
            let { demandInfo } = result;
            res.send({
                code: 0,
                message: 'ok',
                value: { userId, demandInfo }
            });
        } else {
            res.send({
                code: 100,
                message: 'not find user'
            });
        }
    }).catch(err => {
        logger.error(`get user permission failed.err:[${err.message}]`);
        res.sendStatus(500);
    });*/

    //MOCK
    res.send({
        code: 200,
        message: 'success get Mapping Demand Info',
        demandInfo: [			
            {		
                project_BU: "CIC JP CSU Industry",	
                project_name: "mazada new system convertion",	
                project_manager_noteid: "xiao feng zhang/China/IBM",	
                contact_tel: "15998581414",	
                requirement_band_high: "7B",	
                requirement_band_low: "6B",	
                requirement_language: "japanese",	
                requirement_month: "201810",	
                requirement_skill: "JAVA/Cobol"	
                    
            },		
            {		
                project_BU: "CIC JP CSU Cross",	
                project_name: "musashino",	
                project_manager_noteid: "de bin sun/China/IBM",	
                contact_tel: "15998581414",	
                requirement_band_high: "8",	
                requirement_band_low: "7B",	
                requirement_language: "japanese",	
                requirement_month: "201808",	
                requirement_skill: "JAVA/Spring"	
            }		
        ]			
    });
};

module.exports = {
    getResourceRecommondation,
    getDemandRecommondation
};