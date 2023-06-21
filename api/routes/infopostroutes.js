const express = require('express')
const router = express.Router()
const {verifyRoles} = require('../middlewares/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')
const {postinfopost, getinfopost, hideinfopost, editinfopost} =require('../controllers/infopostControllers')

router.route('/post').post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP),postinfopost)
router.route('/get').get(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP, ROLES_LIST.STUDENT, ROLES_LIST.ISMP),getinfopost)
router.route('/hide/:id').put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP),hideinfopost)
router.route('/edit/:id').put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.SMP),editinfopost)

module.exports = router;