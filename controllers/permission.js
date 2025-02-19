const dbServ = require('../server/server')

async function checkAlreadyExistsServicePermission(res, type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right) {
    const returnValidationName = await servicePermissionValidation(res, type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right);

    if (returnValidationName === true) {
        registerNewServicePermission(res, type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right);
    }

}

async function servicePermissionValidation(res, type_user_id, type_service_id) {

    try {
        const [rows, fields] = await dbServ.client.query('SELECT * FROM `type_user_service_right` WHERE `type_user_id` = ? and `type_service_id` = ?', [type_user_id, type_service_id]);
        if (rows.length > 0) {
            res.send({ "status": 22, "message": "Este serviço já existe nesta permissão." })
        } else {
            return true
        }
    } catch (error) {
        res.send(error)
    }
}

async function registerNewServicePermission(res, type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right) {

    const query = 'INSERT INTO type_user_service_right (type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right];


    await dbServ.client.query(query, values)
        .then((result) => {
            res.send({ "status": 1, "message": "As permissões de serviço foram criadas com sucesso." });
        }).catch((error) => {
            res.send({ "status": 23, "message": "Não foi possível adicionar as permições de serviço para esta permissão.", "error": error });
        })

}



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

exports.registerServicePermission = async (req, res) => {
    
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {

        const { type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right } = req.body.data
    
        if (
            !type_user_id || 
            !type_service_id || 
            view_right < 0 && view_right > 1 || view_right === null || 
            edit_right < 0 && edit_right > 1 || edit_right === null ||
            register_right < 0 && register_right > 1 || register_right === null ||
            delete_right < 0 && delete_right > 1 || delete_right === null ||
            action_right < 0 && action_right > 1 || action_right === null ||
            massive_right < 0 && massive_right > 1 || massive_right === null
        ) {
            return res.send({
                status: 5,
                message: "Requisição inválida. Verifique os parâmetros e tente novamente!"
            });
        } else {
            checkAlreadyExistsServicePermission(res, type_user_id, type_service_id, view_right, edit_right, register_right, delete_right, action_right, massive_right)
        }

    }
}