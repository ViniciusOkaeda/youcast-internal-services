const callMotv = require('../utils/motv')
const jsonData = require('./script.json')

async function subs(){
    const retorno = await usersMassa;
    console.log("aqui", retorno)
    retorno.forEach(function(color, idx, sourceArr) {
    console.log("o us", color)
    api.post("api/customer/deleteCustomer", color)
    });
    setUsMass(retorno);
}


async function getProductData(res) {
    const url = "api/Integration/updateMotvCustomer";
    const data = await jsonData

    data.forEach(function(color, idx, sourceArr) {
        console.log("o us", color.data)
        callMotv.callToMotvSMS(url, color.data, res);

    });

    //return productData;

    //console.log("meu dealerData", dealerData)
}
getProductData()

exports.getSmtpsData = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {

    }
}