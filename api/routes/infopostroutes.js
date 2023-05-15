const express = require('express')
const router = express.Router()

const {postinfopost, getinfopost} =require('../controllers/infopostControllers')

router.route('/post').post(postinfopost)
router.route('/get').get(getinfopost)

module.exports = router;