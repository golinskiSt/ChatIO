const logger = reequire('winston');

module.exports = function (err, req, res, next) {
    logger.error(err.message, err);

    res.status(500).send('something went wrong. Try again later!')
}