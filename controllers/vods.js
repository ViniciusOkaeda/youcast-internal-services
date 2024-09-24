const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')

async function getVodData(res) {
    const url = "api/Report/reportSelection";
    const data = {"reportsId": 138}
    const vodData = await callMotv.callToMotvMW(url, data, res);

    return vodData
}

exports.getVodsData = async (req, res, next) => {
    const token = req.cookies.token;
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        const bodyReq = req.body.data[0];
        const bodyId = req.body.data[1];
        const checkString = "Lineup"
    
        if (bodyReq.service_name.includes(checkString) && bodyReq.view_right === 1) {
            
            const vodsResult = await getVodData(res)
            const vodsData = vodsResult.rows.filter(e => e.packages_vods_id.toString() === bodyId)
    
            //console.log("o que tem", vodsData)
    
            res.send({ "status": 1, vodsData})
    
        } else {
            res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
        }
        
    }

}
