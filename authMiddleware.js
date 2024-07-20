// This middleware checks if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session && req.session.username) {
        // User is authenticated, proceed to next middleware or route handler
        next();
    } else {
        // User is not authenticated, redirect to login or handle unauthorized access
        res.status(401).send('Unauthorized');
    }
}

module.exports = isAuthenticated;
