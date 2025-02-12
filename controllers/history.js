const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')
const dbServ = require('../server/server')
const bcrypt = require('bcrypt');


exports.registerHistoryData = async (req, res, next) => {
    const token = req.cookies.token;
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        const bodyReq = req.body.data[0];
        const bodyId = req.body.data[1];
        const checkString = "History"
    
        if (bodyReq.service_name.includes(checkString) && bodyReq.view_right === 1) {
    
            //const channelsResult = await getChannelData(res)
            //const channelsData = channelsResult.rows.filter(e => e.packages_id.toString() === bodyId)
    
            //res.send({ "status": 1, channelsData})
    
        } else {
            //res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
        }
        
    }

}
