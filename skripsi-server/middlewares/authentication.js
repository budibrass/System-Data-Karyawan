const { User } = require("../models");
const { verifyToken } = require("../helpers/jwt");

async function authentication (req, res, next) {
    try {
        let { token } = req.headers;
        let decoded = verifyToken(token);

        const data = await User.findOne({
            where : { email : decoded.email }
        })
        if(!data) throw { msg : `authentication failed`, name : `authenticationFailed`}
        else {
            req.userData = decoded;
            next();
        }
    } catch(err) {
        next(err);
    }
};

module.exports = authentication;