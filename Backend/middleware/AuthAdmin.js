import jwt from 'jsonwebtoken';

// Admin authentication middleware
const authAdmin = async(req, res, next) => {
    try {
        const { atoken } = req.headers;
        
        console.log("Headers received:", req.headers);
        console.log("Token received:", atoken);
        
        if(!atoken) {
            return res.json({success: false, message: "NOT AUTHORIZED LOGIN AGAIN"});
        }
        
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
        console.log("Decoded token:", token_decode);
        console.log("Expected value:", process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD);
        
        if(token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "NOT AUTHORIZED LOGIN AGAIN"});
        }
        
        next();
    } catch (error) {
        console.error("Error in authAdmin middleware:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message 
        });
    }
}

export default authAdmin;