const jwt = require('jsonwebtoken');

module.export = function (req, res, next) {
    const token = req.header('x-auth-token');
    const isAdmin = jwt.verify(token, process.env.JWT_KEY);
    if (!isAdmin.isAdmin) return res.status(403).send('Access denied');
    next();
}