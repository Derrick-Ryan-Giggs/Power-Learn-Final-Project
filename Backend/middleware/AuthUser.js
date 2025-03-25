import jwt from 'jsonwebtoken';

// user authentication middleware
const authUser = async(req, res, next) => {
    try {
        const { token } = req.headers;
        
        if(!token) {
            return res.json({success: false, message: "NOT AUTHORIZED LOGIN AGAIN"});
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decoded.id; // Use decoded.id because your token contains {id: user._id}
        next();
    } catch (error) {
        console.error("Error in authUser middleware:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default authUser;