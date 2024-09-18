require("dotenv").config();

const dbServ = require('../server/server')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    const query = 'SELECT * FROM user WHERE username = ?';

    //console.log("meu req", req.body)

    const [rows, fields] = await dbServ.client.query(query, [req.body.user.login]);

    //console.log("o que temos de rows", rows[0])
    //console.log("o que temos de rows length", rows.length)
    if(rows.length > 0){
        bcrypt.compare(req.body.user.password.toString(), rows[0].password, (err, response) => {
            if(err) {
                res.send({ "status": 14, "message": "Validação de senha com erro" })
            }
            if(response) {
                const name = rows[0].username;
                const user_id = rows[0].user_id;
                console.log("meu nome é ", name)
                console.log("meu rows ", rows[0])
                const token = jwt.sign({name, user_id}, "jwt-secret-key", {expiresIn: '1d'})
                res.cookie('token', token)
                res.cookie('username', name)
                res.send({ "status": 1, "message": "Login efetuado com sucesso" })
                console.log("o que tenho na resposa", response)

            } else{
                res.send({ "status": 13, "message": "Usuário e/ou senha inválido" })
            }
        })
    } else {
        res.send({ "status": 13, "message": "Usuário e/ou senha inválido" })
    }


}


exports.validateToken = async (req, res, next) => {
    const token = req.cookies.token;
    const name = req.cookies.username
    //console.log("meu nome é", name)

    if(req.cookies.token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })
    } else if(!token) {
        res.send({ "status": 2, "message": "Token não autenticado, faça login novamente!" })
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if(err) {
                res.send({ "status": 2, "message": "Token expirado, faça login novamente!" })
            } else {
                //const sla = decoded
                req.name = decoded.name
                //console.log("o sla", sla)
                next();
                res.send({ "status": 1, "message": "Token Autenticado" })

            }
        })
    }
}


exports.logout = async (req, res, next) => {
    const token = req.cookies.token;

    res.clearCookie('token')
    res.clearCookie('username')
    res.send({ "status": 1, "message": "Sessão finalizada com sucesso!" })
    //const name = req.cookies.username
}
