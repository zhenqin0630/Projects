const express = require('express');
const router = express.Router();
const dataController = require('../api/controllers/mappingAction');

router.get('/', function(req, res) {
    res.render('index');
})

router.get('/mapping/resourceRecommondation', dataController.getResourceRecommondation);
router.get('/mapping/demandRecommondation', dataController.getDemandRecommondation);

module.exports = router;