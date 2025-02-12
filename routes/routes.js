const express = require('express');

const router = express.Router();

const path = require('path')

const authController = require('../controllers/auth.js')
const userController = require('../controllers/user.js')
const dealerController = require('../controllers/dealer.js')
const productController = require('../controllers/products.js')
const channelController = require('../controllers/channels.js')
const vodController = require('../controllers/vods.js')
const serviceController = require('../controllers/service.js')
const permissionController = require('../controllers/permission.js')
const smtpController = require('../controllers/smtp.js')
const historyController = require('../controllers/history.js')


router.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

//referente a usuários
router.post('/api/user/register', userController.registerUser)
router.post('/api/user/getUserData', userController.getUserData)
router.post('/api/user/getUsersData', userController.getUsersData)
router.post('/api/user/getUserDataById', userController.getUserDataById)

{/*
    router.post('/api/user/delete', userController.registerUser)
    router.post('/api/user/update', userController.registerUser)
    router.post('/api/user/search', userController.registerUser)
    
*/}

//referente a autenticação
router.post('/api/auth/validateToken', authController.validateToken)
router.post('/api/auth/login', authController.login)
router.post('/api/auth/logout', authController.logout)

//referente a clientes (dealers sms)
router.post('/api/dealer/getDealersData', dealerController.getDealersData)

//referente a produtos
router.post('/api/product/getProductsData', productController.getProductsData)
router.post('/api/product/getWhitelistProductsData', productController.getWhitelistProductsData)

// referente aos channels
router.post('/api/channel/getChannelsData', channelController.getChannelsData)

// referente aos vods
router.post('/api/vod/getVodsData', vodController.getVodsData)

// referente aos services
router.post('/api/service/getServicesData', serviceController.getServicesData)
router.post('/api/service/register', serviceController.registerService)

// referente aos permissions
router.post('/api/permission/getPermissionsData', permissionController.getPermissionsData)
router.post('/api/permission/register', permissionController.registerPermission)
router.post('/api/permission/registerServicePermission', permissionController.registerServicePermission)


// referente ao smtps
router.post('/api/smtp/getSmtpsData', smtpController.getSmtpsData)


//referente aos dados de vendors


//referente ao histórico
router.post('/api/history/register', historyController.registerHistoryData)



module.exports = router;