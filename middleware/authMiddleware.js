const jwt = require('jsonwebtoken');
const User = require('../models/user')
const authMiddleware = async(req, res, next) => {
    // const token = req.headers['authorization'];

    // if (!token) {
    //     return res.status(401).send({ message: 'No token provided' });
    // }

    // Remove 'Bearer ' from token if included
    const token = req.header('Authorization').replace('Bearer ','');
    console.log(token);
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decoded",decoded)
        const user = await User.findOne({ _id: decoded.user_id, 'tokens.token': token });
        console.log("user",user)
        if (!user) {
          throw new Error();
        }
    
        req.token = token;
        req.user = user;
        console.log(user)
        next();
     }
    catch (error) {
        res.status(401).json({ error: 'Please authenticate.' });
      }
};

module.exports = authMiddleware;
