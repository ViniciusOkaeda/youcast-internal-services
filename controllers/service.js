const dbServ = require('../server/server')

async function checkAlreadyExists(res, name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw) {
    const returnValidationName = await nameValidation(res, name);

    if (returnValidationName === true) {
        registerNewService(res, name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw);

    }
}

async function nameValidation(res, name) {

    try {
        const [rows, fields] = await dbServ.client.query('SELECT * FROM `type_service` WHERE `name` = ?', name);
        if (rows.length > 0) {
            res.send({ "status": 20, "message": "Este serviço já existe!" })
        } else {
            return true
        }
    } catch (error) {
        res.send(error)
    }
}

async function registerNewService(res, name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw) {

    const query = 'INSERT INTO type_service (name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw];


    await dbServ.client.query(query, values)
        .then((result) => {
            res.send({ "status": 1, "message": "O Serviço foi criado com sucesso." });
        }).catch((error) => {
            res.send({ "status": 21, "message": "Não foi possível criar o serviço.", "error": error });
        })

}

exports.getServicesData = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {
        checkStringPermission = "Service"
        const bodyReq = req.body.data;

        if (bodyReq.service_name.includes(checkStringPermission) && bodyReq.view_right === 1) {
            const query = 'SELECT * FROM type_service';

            const [rows, fields] = await dbServ.client.query(query);

            const serviceData = await rows;

            res.send({ "status": 1, serviceData})

        } else {
            res.send({ "status": 3, message: "Permissões não encontrados!" })
        }



    }
}

exports.registerService = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {

        const {name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw} = req.body.data
    
        if (!name) {
            return res.send({
                status: 5,
                message: "Requisição inválida. Verifique os parâmetros e tente novamente!"
            });
        } else {
            checkAlreadyExists(res, name, description, middleware_sms, username_sms, secret_sms, middleware_mw, username_mw, secret_mw, aux_sms, aux_mw)
        }

    }
}