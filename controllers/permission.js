const dbServ = require('../server/server')

async function checkAlreadyExists(res, name) {
    const returnValidationName = await nameValidation(res, name);

    if (returnValidationName === true) {
        registerNewPermission(res, name);
    }

}

async function nameValidation(res, name) {

    try {
        const [rows, fields] = await dbServ.client.query('SELECT * FROM `type_user` WHERE `name` = ?', name);
        if (rows.length > 0) {
            res.send({ "status": 18, "message": "Esta permissão já existe!" })
        } else {
            return true
        }
    } catch (error) {
        res.send(error)
    }
}

async function registerNewPermission(res, name) {

    const query = 'INSERT INTO type_user (name) VALUES (?)';
    const values = [name];


    await dbServ.client.query(query, values)
        .then((result) => {
            res.send({ "status": 1, "message": "A permissão foi criado com sucesso." });
        }).catch((error) => {
            res.send({ "status": 19, "message": "Não foi possível criar a permissão.", "error": error });
        })

}

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

exports.registerPermission = async (req, res) => {
    
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {

        const {name} = req.body.data
    
        if (!name) {
            return res.send({
                status: 5,
                message: "Requisição inválida. Verifique os parâmetros e tente novamente!"
            });
        } else {
            checkAlreadyExists(res, name)
        }

    }
}