/*
Common functions to many controllers; for minimalising duplicated code
 */



/*
reference function for controllers
 */
function checkNotEmpty(req, res) {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
            error: 'Bad Request',
            message: 'The request body is empty'
        });
    return false;
}

/*
Checks if req.body contains property given. Does not validate. Ie. @property as 'lng'
 */
function checkProperty(req, res, property) {
    if (!Object.prototype.hasOwnProperty.call(req.body, property)) return res.status(400).json({
        error: 'Bad Request',
        message: 'Send '.concat(property, ' property')
    });
    return false;
}



/*
Checks if the requests logged in user id is the same as the id given. The given userId ( @userId ) can come from
req.params.id for requests to User object, or a derived owner field. Ie. if requester wants to access an object, follow:
1) check object(s) exist
2) get owner id of objects
3) input owner id of objects as userId to this function, with normal req and res functions
- this way only owner can edit etc.
 */
function checkUsersMatch(req, res, userId) {
    if(typeof req.userId == 'undefined') {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'User authentication process failed' /* hint: auth middleman function should be called before,
            which should always ensure user id is set */
        });
    }
    if (userId !== req.userId) { // id of the
        return res.status(401).json({
            error: 'Bad Request',
            message: 'Inappropiate object access'
        });
    }
    return false;
}

module.exports = {
    checkUsersMatch,
    checkNotEmpty,
    checkProperty
};