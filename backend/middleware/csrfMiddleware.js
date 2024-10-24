const crypto = require('crypto');

function generateCSRFToken() {
    return crypto.randomBytes(32).toString('hex');
}

module.exports = (req, res, next) => {
    if (!req.session.csrfToken) {
        req.session.csrfToken = generateCSRFToken();
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
};
