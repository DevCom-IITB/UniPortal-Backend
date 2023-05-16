const express = require('express')
const router = express.Router()
const {indexDoc,searchDoc,deleteDoc}=require('../controllers/elasticController')
const {verifyRoles} = require('../middlewares/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')

router.route('/').get(verifyRoles(ROLES_LIST.Admin,ROLES_LIST.SMP,ROLES_LIST.STUDENT),searchDoc)
module.exports=router