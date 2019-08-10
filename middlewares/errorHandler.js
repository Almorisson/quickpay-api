exports.unAuthorizedError = (error, req, res, next) => {
    if (error.name === 'UnauthorizedError') {
        res.status(401).json({
            error: "You must logged in first to access to this resource."
        });
    }

   next();
}

exports.errors = (error, req, res, next) => {

    const status = error.statusCode || 500;
    const message = error.message
    const data = error.data
    const validation = error.validation

    res.status(status).json({
        message,
        data,
        validation
    })
}
