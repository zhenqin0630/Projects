var express = require('express');
var router = express.Router();

var resCtrl = require('../controller/resourcecontroller');

/* GET home page.(no use) */
router.get('/resource', resCtrl.getIndex);

/* GET OR DELETE RES BY ID */
router.get('/resource/id/:id', resCtrl.getResById);
router.delete('/resource/id/:id', resCtrl.delResById);

router.get('/resource/pem/:pem', resCtrl.getResByPem);
router.delete('/resource/pem/:pem', resCtrl.delResByPem);

router.get('/resource/project/:project', resCtrl.getResByProject);
router.delete('/resource/project/:project', resCtrl.delResByProject);

router.post('/resourceSearchByConditions', resCtrl.getResByCondition);

router.post('/resource', resCtrl.addRes);
router.put('/resource', resCtrl.updateRes);

module.exports = router;