const express = require('express');
const router = express.Router();
const dataController = require('../api/controllers/data');

router.get('/v1/permission/:userId/:permission', dataController.checkPermission);
router.put('/v1/permission/data', dataController.addPermission);
router.post('/v1/permission/data', dataController.bulkUpdatePermissions);
router.get('/v1/permission/data/:userId', dataController.getPermission);
router.delete('/v1/permission/data/:userId', dataController.deletePermission);

module.exports = router;