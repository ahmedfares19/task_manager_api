const jwt = require('jsonwebtoken');
const User = require('../models/users')

//this is a middleware function to check the authanication of the user 
const auth = async (req, res, next) => {
    try {
        //get the value of the Authorization Key in the header
        //replace Bearer in the token with space
        const token = req.header('Authorization').replace('Bearer ', '')
        //decode this token to get the id back
        const decode = jwt.verify(token, 'thisismytrainingtoken');
        //check the existence of the token 
        const user = await User.findOne({
            _id: decode._id,
            'tokens.token': token
        })
        if (!user) {
            throw new Error('user not found')
        }
        //to save the user so we can access to it in the router
        req.user = user;
        req.token = token;
        next()
    } catch (err) {
        res.status(401).send({
            'error': 'please authenticate'
        })
    }
}

module.exports = auth;

//5e169ba536d1527706d399f0