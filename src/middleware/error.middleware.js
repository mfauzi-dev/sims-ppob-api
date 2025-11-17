class ResponseError extends Error {
    constructor(httpStatus, message, customStatus = null) {
        super(message);
        this.httpStatus = httpStatus;
        this.customStatus = customStatus;
    }
}

export const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof ResponseError) {
        res.status(err.httpStatus)
            .json({
                status: err.customStatus || err.httpStatus,
                message: err.message,
                data: null,
            })
            .end();
    } else {
        res.status(500)
            .json({
                status: 500,
                message: err.message,
                data: null,
            })
            .end();
    }
};

export { ResponseError };
