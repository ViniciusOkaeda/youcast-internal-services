require("dotenv").config();

const dbServ = require('../server/server')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const GetUserInfoAndPermissions = async ( userToken, res ) => {
    const jwtVerify = await jwt.verify(userToken, "jwt-secret-key", async (err, decoded) => {
        if (err) {
            res.send({ "status": 2, "message": "Token expirado, faça login novamente!" })
        } else {
            const dataDecoded = await decoded
            try {
                const [rows, fields] = await dbServ.client.query(
                    `SELECT 
                    us.user_id,
                    us.username,
                    us.name,
                    us.lastname,
                    us.email,
                    us.type_user_id,
                    us.active,
                    us.last_acess,
                    tu.name as "type_user"
                    FROM user us
                    INNER JOIN type_user tu ON us.type_user_id = tu.type_user_id
                    WHERE us.user_id = ?`, [dataDecoded.user_id]
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
    })
    // se necessário é possivel obter os dados do usuário através do retorno do jwtVerify
    const userId = jwtVerify.map(e => e.type_user_id)[0]

    const checkPermissions = await dbServ.client.query(
                `SELECT 
                    tsr.type_user_service_right_id,
                    tsr.type_user_id,
                    tsr.type_service_id,
                    ts.name as "service_name",
                    ts.aux_sms,
                    ts.aux_mw,
                    tsr.view_right,
                    tsr.edit_right,
                    tsr.register_right,
                    tsr.delete_right,
                    tsr.massive_right,
                    tsr.action_right
                    FROM type_user_service_right tsr
                    INNER JOIN type_service ts ON tsr.type_service_id = ts.type_service_id
                    WHERE tsr.type_user_id = ?`, [userId]
    );
    if(checkPermissions.length > 0) {
        return checkPermissions[0]
    } else {
        res.send({ "status": 3, "message": "Permissões de serviços não encontrados!" });
    }
}

module.exports = {
    GetUserInfoAndPermissions
}