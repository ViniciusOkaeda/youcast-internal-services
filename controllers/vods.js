const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')

async function getVodData(res) {
    const url = "api/Report/reportSelection";
    const data = {"reportsId": 138}
    const vodData = await callMotv.callToMotvMW(url, data, res);

    return vodData
}

exports.getVodsData = async (req, res, next) => {
    const bodyReq = req.body.data[0];
    const checkString = "Lineup"

    if (bodyReq.service_name.includes(checkString) && bodyReq.view_right === 1) {
        
        const vodsData = await getVodData(res)

        console.log("o que tem", vodsData)

        res.send({ "status": 1, vodsData})

    } else {
        res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
    }

}
