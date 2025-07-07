
function errorHandler (err,req,res,next){
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    const message = err.message || "Terjadi kesalahan pada server.";

    res.status(statusCode).json({
        success: false,
        message: message
    });
}

export default errorHandler