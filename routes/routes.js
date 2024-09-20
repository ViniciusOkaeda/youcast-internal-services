const express = require('express');

const router = express.Router();


const path = require('path')

const authController = require('../controllers/auth.js')
const userController = require('../controllers/user.js')
const dealerController = require('../controllers/dealer.js')
const lineupController = require('../controllers/lineup.js')
const vendorController = require('../controllers/vendor.js')
const productController = require('../controllers/products.js')
const channelController = require('../controllers/channels.js')
const vodController = require('../controllers/vods.js')


router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

//referente a usuários
router.post('/api/user/register', userController.registerUser)
router.post('/api/user/getUserData', userController.getUserData)
{/*
    router.post('/api/user/delete', userController.registerUser)
    router.post('/api/user/update', userController.registerUser)
    router.post('/api/user/search', userController.registerUser)
    
*/}


//referente a autenticação
router.post('/api/auth/validateToken', authController.validateToken)
router.post('/api/auth/login', authController.login)
router.post('/api/auth/logout', authController.logout) // nao funciona ainda

//referente a clientes (dealers sms)
router.post('/api/dealer/getDealersData', dealerController.getDealersData)

//referente a produtos
router.post('/api/product/getProductsData', productController.getProductsData)
router.post('/api/product/getWhitelistProductsData', productController.getWhitelistProductsData)

// referente ao lineup
router.post('/api/lineup/getLineupData', lineupController.getLineupData)

// referente aos channels
router.post('/api/channel/getChannelsData', channelController.getChannelsData)

// referente aos vods
router.post('/api/vod/getVodsData', vodController.getVodsData)


//referente aos dados de vendors




module.exports = router;