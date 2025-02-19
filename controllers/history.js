const callMotv = require('../utils/motv')
const dbServ = require('../server/server')
const getUserDet = require('../utils/constants')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerHistoryData = async (req, res, next) => {
    const token = req.cookies.token;
    if (token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })

    } else {

    }
}



exports.getHistoryTypes = async (req, res, next) => {
    const token = req.cookies.token;

    if (token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        const userPermissions = await getUserDet.GetUserInfoAndPermissions(token, res)
        if (userPermissions.map(e => e.service_name.includes("History"))) {
            const checkRight = userPermissions.filter(e => e.service_name.includes("History"))
            console.log("no check tem", checkRight)
            if (checkRight[0].view_right === 1) {
                const query = 'SELECT * FROM history_register_type';

                const [rows, fields] = await dbServ.client.query(query);

                res.send({"status": 1, rows})


            } else {
                res.send({ "status": 26, "message": "Você não tem permissão de visualizar o histórico." })
            }
        } else {
            res.send({ "status": 27, "message": "Você não pode utilizar este serviço." })
        }
    }
}

exports.registerHistoryType = async (req, res, next) => {
    const token = req.cookies.token;
    const bodyReq = req.body

    if (token === undefined) {
        res.send({ "status": 16, "message": "Token inválido" })

    } else {
        console.log("to aqui")
        try {
            const [rows, fields] = await dbServ.client.query(
                `SELECT *
                    FROM history_register_type hrt
                    WHERE hrt.name = ?`, [bodyReq.data.name]
            );

            if (rows.length > 0) {
                res.send({ "status": 24, "message": "Este histórico já existe!" })
            } else {
                const query = 'INSERT INTO history_register_type (name) VALUES (?)';
                const values = [bodyReq.data.name];


                await dbServ.client.query(query, values)
                    .then((result) => {
                        res.send({ "status": 1, "message": "O histórico foi criado com sucesso." });
                    }).catch((error) => {
                        res.send({ "status": 25, "message": "Não foi possível criar o histórico.", "error": error });
                    })
            }
        } catch (error) {
            res.send(error)
        }
    }
}