const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')

async function getProductData(res) {
    const url = "api/report/reportSelection";
    const data = { "reports_id": 298 }
    const productData = await callMotv.callToMotvSMS(url, data, res);

    return productData;

    //console.log("meu dealerData", dealerData)
}

async function getWhitelistProductData(res) {
    const url = "api/report/reportSelection";
    const data = {"reports_id": 425}
    const productData = await callMotv.callToMotvSMS(url, data, res);

    return productData
}

exports.getProductsData = async (req, res, next) => {
    const bodyReq = req.body.data[0];
    const checkStringTotalMedia = "Report Total Media"
    const checkStringNow = "Report Now+"

    if (bodyReq.service_name.includes(checkStringTotalMedia) && bodyReq.view_right === 1) {

        // Função auxiliar para simplificar a obtenção de valores de produtos
        const getProductDetails = (item) => {
            const productDetails = {
                haveTotalMedia: item.product === "Total Media Colombia" || item.product === "Total Media Colombia - 4 TELAS" ? 1 : 0,
            };
            return productDetails;
        };

        // Função para criar a lista de produtos
        const newProductsList = (array, customerLogin, customerSmsId, customerMwId) => {
            return array
                .filter(item => customerLogin.includes(item.login) && customerMwId === item.idmw && customerSmsId === item.idsms)
                .map(item => ({
                    product: item.product,
                    productid: item.productid,
                    activation: item.activation,
                    cancelled: item.cancelled,
                    ...getProductDetails(item)
                }));
        };

        // Função para criar a lista de clientes
        const newCustomersList = (array, dealerName, dealerId) => {
            const uniqueCustomers = Array.from(new Map(array.map(item => [item.login, item])).values());

            return uniqueCustomers
                .filter(item => dealerName.includes(item.dealer))
                .map(item => ({
                    login: item.login,
                    idsms: item.idsms,
                    idmw: item.idmw,
                    dealer: item.dealer,
                    dealerid: item.dealerid,
                    vendor: item.vendor,
                    vendorid: item.vendorid,
                    packages: newProductsList(array, item.login, item.idsms, item.idmw),
                }));
        };

        // Função para criar a lista de dealers
        const newDealersList = (array) => {
            const uniqueDealers = Array.from(new Map(array.map(item => [item.dealer, item])).values());
            return uniqueDealers.map(item => ({
                dealer: item.dealer,
                dealerId: item.dealerid,
                parentDealer: item.parentdealer,
                vendor: item.vendor,
                vendorid: item.vendorid,
                customers: newCustomersList(array, item.dealer, item.dealerid),
            }));
        };

        const filterDemoLogin = (array) => {
            //aqui será o local para incluir a lógica de validar se o usuário fez login (do mw)
            return array.filter(item => !item.login.toLowerCase().includes('.demo') && 
            !item.login.toLowerCase().includes('demo.') && 
            !item.login.toLowerCase().includes('test') && 
            !item.login.toLowerCase().includes('youcast') && 
            !item.login.toLowerCase().includes('.yc') && 
            !item.login.toLowerCase().includes('yc.') && 
            !item.login.toLowerCase().includes('yplay') && 
            !item.login.toLowerCase().includes('trial')  
            )
        }

        // Execução final
        const productDataNoFiltered = await getProductData(res);
        const productFilterLogin = await filterDemoLogin(productDataNoFiltered.rows)
        const productData = await newDealersList(productFilterLogin);

        res.send({ "status": 1, productData })

    } else if (bodyReq.service_name.includes("Report Now+") && bodyReq.view_right === 1) {

    } else {
        res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
    }



}


exports.getWhitelistProductsData = async (req, res, next) => {
    const bodyReq = req.body.data[0];
    const checkStringTotalMedia = "Report Total Media"
    const checkStringNow = "Report Now+"
    const checkString = "Lineup"


    if (bodyReq.service_name.includes(checkString) && bodyReq.view_right === 1) {

        const productsInfo = await getWhitelistProductData(res);

        res.send({ "status": 1, productsInfo })

    } else if (bodyReq.service_name.includes("Report Now+") && bodyReq.view_right === 1) {

    } else {
        res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
    }



}