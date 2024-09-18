require("dotenv").config();

const sha1 = require('js-sha1');
const axios = require('axios')

async function callToMotvMW(url, data, res) {
    var timestamp = new Date().getTime();
    const str = timestamp + process.env.MW_LOGIN + process.env.MW_SECRET;
    const hashSha1 = sha1(str);
    const authHead = process.env.MW_LOGIN + ':' + timestamp + ':' + hashSha1; 
    
    const api = axios.create({
      baseURL: process.env.MW_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        "Authorization-user": authHead
      }
    });

    const resp = await api.post(url, {data})
    .then(function (response) {
        return response.data.response
    }).catch((error) => {
        res.send({ "status": 7, "message": "Motv error, consulte nossos desenvolvedores." })
    })

    return resp

}

async function callToMotvSMS(url, data, res) {
    var timestamp = new Date().getTime();
    const str = timestamp + process.env.SMS_LOGIN + process.env.SMS_SECRET;
    const hashSha1 = sha1(str);
    const authHead = process.env.SMS_LOGIN + ':' + timestamp + ':' + hashSha1; 
    
    const api = axios.create({
      baseURL: process.env.SMS_URL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Authorization: authHead
      }
    });

    const resp = await api.post(url, {data})
    .then(function (response) {
        return response.data.response
    }).catch((error) => {
        res.send({ "status": 7, "message": "Motv error, consulte nossos desenvolvedores." })
    })

    return resp

}


module.exports = { callToMotvSMS,  callToMotvMW}