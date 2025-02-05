require("dotenv").config();

const dbServ = require('../server/server')

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function checkAlreadyExists(res, name, email, username, password, lastname, type_user_id, active) {
    const returnValidationEmail = await emailValidation(res, email);

    if (returnValidationEmail === true) {
        const returnValidationUsername = await usernameValidation(res, username);
        if (returnValidationUsername === true) {
            registerNewUser(res, name, email, username, password, lastname, type_user_id, active);
        }
    }

}

async function emailValidation(res, email) {

    try {
        const [rows, fields] = await dbServ.client.query('SELECT * FROM `user` WHERE `email` = ?', email);
        if (rows.length > 0) {
            res.send({ "status": 11, "message": "O email já está sendo utilizado." })
        } else {
            return true
        }
    } catch (error) {
        res.send(error)
    }
}

async function usernameValidation(res, username) {
    try {
        const [rows, fields] = await dbServ.client.query('SELECT * FROM `user` WHERE `username` = ?', username);
        if (rows.length > 0) {
            res.send({ "status": 12, "message": "O nome de usuário já está sendo utilizado." })
        } else {
            return true
        }
    } catch (error) {
        res.send(error)
    }
}

async function registerNewUser(res, name, email, username, senha, lastname, type_user_id, active) {
    const password = await bcrypt.hash(senha.toString(), 10)

    const query = 'INSERT INTO user (name, email, username, password, lastname, type_user_id, active) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = [name, email, username, password, lastname, type_user_id, active];


    await dbServ.client.query(query, values)
        .then((result) => {
            res.send({ "status": 1, "message": "O usuário foi criado com sucesso." });
        }).catch((error) => {
            res.send({ "status": 6, "message": "Não foi possível criar o usuário.", "error": error });
        })

}

async function getTokenInfo(token, res) {

    //console.log("o que temos aqui", token)

    const jwtVerify = await jwt.verify(token, "jwt-secret-key", async (err, decoded) => {
        if (err) {
            res.send({ "status": 2, "message": "Token expirado, faça login novamente!" })
        } else {
            const dataDecoded = await decoded

            //console.log("values", dataDecoded)

            return dataDecoded;
            //req.name = decoded.name
            //console.log("o getTokenInfo", sla)
            //next();
            //res.send({ "status": 1, "message": "Token Autenticado" })

        }
    })

    return jwtVerify

    //console.log("o meu teste", teste)

}

async function getUserServicesInfo(userDetails, res) {
    try {
        const [rows, fields] = await dbServ.client.query(
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
                WHERE tsr.type_user_id = ?`, [userDetails]
        );
        if (rows.length > 0) {
            return rows
        } else {
            res.send({ "status": 3, "message": "Permissões de serviços não encontrados!" });
        }


    } catch (error) {
        res.send({ "status": 4, "message": "Erro na validação de permissões, consulte nossos desenvolvedores." });
    }

}

async function getUserInfo(userDetails, res) {
    //console.log("meu userDetails", userDetails)
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
            WHERE us.user_id = ?`, [userDetails.user_id]
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

exports.registerUser = async (req, res) => {
    const token = req.cookies.token;
    console.log("meu req.", req.body.data.username)
    /*
    
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })
    }
    else {    }
    
    */
        const { username, password, confirmPassword, name, lastname, email, type_user_id, active } = req.body.data
    
        if (!name || !email || !username || !password || !lastname || !type_user_id || !active) {
            return res.send({
                status: 5,
                message: "Requisição inválida. Verifique os parâmetros e tente novamente!"
            });
        } else if (username.length < 3) {
            res.send({ "status": 8, "message": "O nome de usuário deve conter no mínimo 3 caracteres." });
        } else if (password.length < 5) {
            res.send({ "status": 9, "message": "A senha deve conter no mínimo 5 caracteres." });
        } else if (password !== confirmPassword) {
            res.send({ "status": 10, "message": "As senhas não coincidem" });
        } else {
            checkAlreadyExists(res, name, email, username, password, lastname, type_user_id, active)
        }
        



}

exports.getUserData = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        console.log("meu body", req.body)
        const userDetails = await getTokenInfo(req.cookies.token, res);
        const userInfo = await getUserInfo(userDetails, res)
        console.log("meu user info é", userInfo)
        const userActiveServices = await getUserServicesInfo(userInfo.map(e => e.type_user_id)[0], res)
    
        const data = [{
            userInfo: userInfo,
            availableServices: userActiveServices
        }]
        res.send({ "status": 1, data })
        
    }

}

exports.getUsersData = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else {
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
                INNER JOIN type_user tu ON us.type_user_id = tu.type_user_id`
            );
    
            if (rows.length > 0) {
                const usersData = await rows
                res.send({ "status": 1, usersData})
            } else {
                res.send({ "status": 15, "message": "Erro ao obter dados do usuário, consulte nossos desenvolvedores." })
            }
        } catch (error) {
            res.send(error)
        }

    }
}

exports.getUserDataById = async (req, res) => {
    const token = req.cookies.token;
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        const userDetails = await getTokenInfo(req.cookies.token, res);
        const userInfo = await getUserInfo(req.body, res)
        const userActiveServices = await getUserServicesInfo(userInfo.map(e => e.type_user_id)[0], res)
    
        const data = [{
            userInfo: userInfo,
            availableServices: userActiveServices
        }]
        res.send({ "status": 1, data })
        
    }
}



