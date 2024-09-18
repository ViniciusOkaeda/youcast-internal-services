require("dotenv").config();

const dbServ = require('../server/server')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sha1 = require('js-sha1');
const axios = require('axios')
const callMotv = require('../utils/motv')



async function callToMotvMW(url, data) {
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

    })

    return resp

}

async function callToMotvSMS(url, data) {
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

    })

    return resp

}


async function getTokenInfo(token, res) {

    console.log("o que temos aqui", token)

    const jwtVerify = await jwt.verify(token, "jwt-secret-key", async (err, decoded) => {
        if (err) {
            res.send({ "status": 2, "message": "Token expirado, faça login novamente!" })
        } else {
            const dataDecoded = await decoded

            //console.log("values", dataDecoded)

            return dataDecoded;
            //req.name = decoded.name
            //console.log("o getTokenInfo", sla)
            //next();
            //res.send({ "status": 1, "message": "Token Autenticado" })

        }
    })

    return jwtVerify

    //console.log("o meu teste", teste)

}


async function getDealerData(res) {
    const url = "api/report/reportSelection";
    const data = {"reports_id": 424}
    const dealerData = await callToMotvSMS(url, data, res);

    return dealerData;

    //console.log("meu dealerData", dealerData)
}
async function getProductData(res) {
    const url = "api/report/reportSelection";
    const data = {"reports_id": 425}
    const productData = await callToMotvSMS(url, data, res);

    return productData
}

async function getChannelData(res) {
    const url = "api/Report/reportSelection";
    const data = {"reportsId": 137}
    const channelData = await callToMotvMW(url, data, res);

    return channelData
}
async function getVodData(res) {
    const url = "api/Report/reportSelection";
    const data = {"reportsId": 138}
    const vodData = await callToMotvMW(url, data, res);

    return vodData
}



async function getUserServicesInfo(userDetails, res) {
    try {
        const [rows, fields] = await dbServ.client.query(
            `SELECT 
                tsr.type_user_service_right_id,
                tsr.type_user_id,
                tsr.type_service_id,
                ts.name as "service_name",
                tsr.view_right,
                tsr.edit_right,
                tsr.register_right,
                tsr.delete_right,
                tsr.massive_right,
                tsr.action_right
                FROM type_user_service_right tsr
                INNER JOIN type_service ts ON tsr.type_service_id = ts.type_service_id
                WHERE tsr.type_user_id = ?`, [userDetails]
        );
        if (rows.length > 0) {
            return rows
        } else {
            res.send({ "status": 3, "message": "Permissões de serviços não encontrados!" });
        }


    } catch (error) {
        res.send({ "status": 4, "message": "Erro na validação de permissões, consulte nossos desenvolvedores." });
    }

}

async function getUserInfo(userDetails, res) {
    try {
        const [rows, fields] = await dbServ.client.query(
            `SELECT 
            us.user_id,
            us.username,
            us.name,
            us.lastname,
            us.email,
            us.type_user_id,
            tu.name as "type_user"
            FROM user us
            INNER JOIN type_user tu ON us.type_user_id = tu.type_user_id
            WHERE us.username = ? AND us.user_id = ?`, [userDetails.name, userDetails.user_id]
        );

        if (rows.length > 0) {
            return rows
        } else {
            res.send({ "status": 15, "message": "Erro ao obter dados do usuário, consulte nossos desenvolvedores." })
        }
    } catch (error) {
        res.send(error)
    }
}




exports.getLineupData = async (req, res) => {
    const bodyReq = req.body.data[0];
    const checkString = "General"

    const dealerInfo = await getDealerData(res);

    const productsInfo = await getProductData(res);

    const channelInfo = await getChannelData(res);
    const vodInfo = await getVodData(res);







    if(bodyReq.service_name.includes(checkString)) {

        const data = [{
            dealersInfo: dealerInfo,
            productsInfo: productsInfo,
            channelsInfo: channelInfo,
            vodsInfo: vodInfo
        }]

        res.send({ "status": 1, data})

    } else {
        console.log("nao aparece")
    }

    //const userDetails = await getTokenInfo(req.cookies.token, res);
    //const userInfo = await getUserInfo(userDetails, res)
    //const userActiveServices = await getUserServicesInfo(userInfo.map(e => e.type_user_id)[0], res)


    //res.send({ "status": 1, data })

}