const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')

async function getDealerData(res) {
    const url = "api/report/reportSelection";
    const data = { "reports_id": 424 }
    const dealerDataSms = await callMotv.callToMotvSMS(url, data, res);

    const changeDealerIdToName = (dealer_id) => {

        switch (dealer_id) {
            case 1:
                return "";
            case 5:
                return "Vendor";
            case 15:
                return "Brand Yplay";
            case 23:
                return "Brand WSP";
            case 25:
                return "Brand Yplay - Cariap";
            case 41:
                return "Brand Yplay - IDCORP";
            case 134:
                return "Brand Olla";
            case 148:
                return "Brand Yplay - Alloha";
            case 153:
                return "Brand Yplay CO";
            case 166:
                return "Brand ClickIP";
            case 177:
                return "Brand Yplay CO - Fibercomm";
            case 178:
                return "Brand SouPlay";
            case 181:
                return "Brand Nortetel";
            case 184:
                return "Brand Yplay - Alloha";
            case 186:
                return "Brand Yplay - Alloha";
            case 190:
                return "Brand Yplay - Alloha";
            case 219:
                return "Brand Yplay - InterfaceNet";
            case 263:
                return "Brand Newbrasil";
            case 278:
                return "Brand Uni";
            case 299:
                return "Brand Yplay - Kase";
            default:
                return "N/A";
        }

    }
    
    const dealerData = dealerDataSms.rows.map((item, idx) => {
        const rows = {
            dealers_id: item.dealers_id,
            dealers_name: item.dealers_name,
            dealers_active: item.dealers_active,
            parent_dealers_id: item.parent_dealers_id,
            dealers_category: changeDealerIdToName(item.parent_dealers_id),
            dealers_company_name: item.dealers_company_name,
            dealers_fantasy_name: item.dealers_fantasy_name,
            dealers_cnpj: item.dealers_cnpj,
            dealers_city: item.dealers_city,
            dealers_state: item.dealers_state
    
        }

        return rows


    })

    return dealerData;
}

async function filterDataTotalMedia(dealerInfo) {
    const filterInfo = dealerInfo
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