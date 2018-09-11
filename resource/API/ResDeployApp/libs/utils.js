var utils = {
    makeJson:function(results, bBothNeed) {
        var resDataArray = [];

        for(var i = 0; i < results.length; i++) {
            var resData = {
                resource_BU:results[i].businessunit,
                resource_name:results[i].uname,
                resource_noteid:results[i].noteid,
                resource_manager:results[i].pem,
                contact_tel:results[i].contacttel,
                resource_band:results[i].band,
                resource_availdate:results[i].onboardtime,
                resource_current_Project:results[i].project,
                resource_current_ProjectManager:results[i].pm
            };

            //tech
            var techskillArray = [];
            for(var j = 0; j < results[i].resource_skill.rowCount; j++){
                if(results[i].resource_skill.rows[j].techskill != null) {
                    var techskill = {skill:results[i].resource_skill.rows[j].techskill, skill_expe:results[i].resource_skill.rows[j].experience};
                    techskillArray.push(techskill);
                }
            }
            resData.resource_skill = techskillArray;

            //language
            var langskillArray = [];
            for(var j = 0; j < results[i].resource_language.rowCount; j++){
                var langskill = {language:results[i].resource_language.rows[j].language, language_expe:results[i].resource_language.rows[j].experience};
                langskillArray.push(langskill);
            }
            resData.resource_language = langskillArray;

            if(bBothNeed) {
                if(results[i].resource_skill.rowCount > 0 && results[i].resource_language.rowCount > 0) {
                    resDataArray.push(resData);
                }    
            } else {
                resDataArray.push(resData);
            }
        }

        return resDataArray;
    }
};

module.exports = utils;