const jwt = require('jsonwebtoken');
const callMotv = require('../utils/motv')


async function getChannelData(res) {
    const url = "api/Report/reportSelection";
    const data = {"reportsId": 137}
    const channelData = await callMotv.callToMotvMW(url, data, res);

    return channelData
}

exports.getChannelsData = async (req, res, next) => {
    const bodyReq = req.body.data[0];
    const bodyId = req.body.data[1];
    const checkString = "Lineup"

    if (bodyReq.service_name.includes(checkString) && bodyReq.view_right === 1) {

        const channelsResult = await getChannelData(res)
        const channelsData = channelsResult.rows.filter(e => e.packages_id.toString() === bodyId)

        res.send({ "status": 1, channelsData})

    } else {
        res.send({ "status": 3, message: "Permissões de serviços não encontrados!" })
    }



}
