require("dotenv").config();

const dbServ = require('../server/server')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const getBrazilianDateTimeString = () => {
    const offset = -3; // Horário padrão (UTC-3)
    const now = new Date();

    // Obtemos a data e hora em UTC
    const utcDate = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brazilianDate = new Date(utcDate + (offset * 3600000));

    // Captura ano, mês, dia, hora, minutos e segundos
    const year = brazilianDate.getFullYear();
    const month = String(brazilianDate.getMonth() + 1).padStart(2, '0');
    const day = String(brazilianDate.getDate()).padStart(2, '0');
    const hour = String(brazilianDate.getHours()).padStart(2, '0');
    const minutes = String(brazilianDate.getMinutes()).padStart(2, '0');
    const seconds = String(brazilianDate.getSeconds()).padStart(2, '0');

    // Retorna tudo em uma única string
    return `${year}-${month}-${day}T${hour}:${minutes}:${seconds}`;
};

async function updateLastAcess(today, user_id) {
    const query = 'UPDATE user SET last_acess = ? WHERE user_id = ?';

    const [rows, fields] = await dbServ.client.query(query, [today, user_id]);

}

exports.login = async (req, res) => {
    const query = 'SELECT * FROM user WHERE username = ?';

    const [rows, fields] = await dbServ.client.query(query, [req.body.user.login]);

    if(rows.length > 0){
        bcrypt.compare(req.body.user.password.toString(), rows[0].password, (err, response) => {
            if(err) {
                res.send({ "status": 14, "message": "Validação de senha com erro" })
            }
            if(response) {

                const name = rows[0].username;
                const user_id = rows[0].user_id;
                const checkIsActive = rows[0].active
                if(checkIsActive === 1) {
                    const currentDateTime = getBrazilianDateTimeString();
                    const token = jwt.sign({name, user_id}, "jwt-secret-key", {expiresIn: '1d'})
                    res.cookie('token', token)
                    res.cookie('username', name)
                    const updateAcess = updateLastAcess(currentDateTime, user_id);
                    res.send({ "status": 1, "message": "Login efetuado com sucesso" })

                } else {
                    res.send({ "status": 17, "message": "O usuário está inativo!" })

                }

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
    if(token === undefined){
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        res.clearCookie('token')
        res.clearCookie('username')
        res.send({ "status": 1, "message": "Sessão finalizada com sucesso!" })
    }
}
