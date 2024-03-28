const jwt = require('jsonwebtoken')

// load environment variables from .env file
require('dotenv').config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET

function getAccessToken(user){
    return jwt.sign(user, ACCESS_TOKEN_SECRET)
}

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(" ")[1]  

    if(token === null) return res.status(401).json({ error: "Request does not have a token"})

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).json({ error: "Token used is not valid"})
        next()
    })
}

module.exports = {
    getAccessToken,
    authenticateToken
}