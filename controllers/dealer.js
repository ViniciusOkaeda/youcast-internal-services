const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')

async function getDealerData(res) {
    const url = "api/report/reportSelection";
    const data = { "reports_id": 424 }
    const dealerData = await callMotv.callToMotvSMS(url, data, res);

    return dealerData;

    //console.log("meu dealerData", dealerData)
}

async function filterDataTotalMedia(dealerInfo) {
    //console.log("o dealerInfo", dealerInfo.map(e => e))
    const filterInfo = dealerInfo.rows
        .filter(item => 
            item.parent_dealers_id === 153 || item.dealers_name === 'ZUMA' 
        )

        return filterInfo
}
async function filterDataNow() {

}


exports.getDealersData = async (req, res, next) => {
    const token = req.cookies.token;

    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        const bodyReq = req.body.data[0];
        const checkStringLineup = "Lineup"
        const checkStringTotalMedia = "Report Total Media"
        const checkStringNow = "Report Now+"
    
        const dealerInfo = await getDealerData(res);
        
        if (bodyReq.service_name.includes(checkStringLineup) && bodyReq.view_right === 1) {
            const data = [{
                dealersInfo: dealerInfo
            }]
    
            res.send({ "status": 1, data })
    
        } else if (bodyReq.service_name.includes(checkStringTotalMedia) && bodyReq.view_right === 1) {
            
            const dealerData = await filterDataTotalMedia(dealerInfo);
            res.send({ "status": 1, dealerData })
    
        } else if (bodyReq.service_name.includes("Report Now+") && bodyReq.view_right === 1) {
    
        } else {
            res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
        }
    }

}