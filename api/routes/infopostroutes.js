const express = require('express')
const router = express.Router()

const {postinfopost, getinfopost} =require('../controllers/infopostControllers')

router.route('/').post(postinfopost).get(getinfopost)

module.exports = router;