require("dotenv").config();

const dbServ = require('../server/server')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sha1 = require('js-sha1');
const axios = require('axios')
const callMotv = require('../utils/motv')


exports.getVendorData = async (req, res) => {

    res.send({ "status": 1 })

}