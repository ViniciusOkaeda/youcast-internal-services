const dbServ = require('../server/server')

exports.getPermissionsData = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {
        checkStringPermission = "Permission"
        const bodyReq = req.body.data;
        //console.log("Meu bodyReq", bodyReq)

        if (bodyReq.service_name.includes(checkStringPermission) && bodyReq.view_right === 1) {
            const query = 'SELECT * FROM type_user';

            const [rows, fields] = await dbServ.client.query(query);

            const permissionData = await rows;

            res.send({ "status": 1, permissionData})

        } else {
            res.send({ "status": 3, message: "Permissões não encontrados!" })
        }
    }
}