import jwt from 'jsonwebtoken';

// doctor authentication middleware
const authDoctor = async(req, res, next) => {
    try {
        const { dtoken } = req.headers;
        
        if(!dtoken) {
            return res.json({success: false, message: "NOT AUTHORIZED LOGIN AGAIN"});
        }
        
        const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);
        req.body.docId = decoded.id; // Use decoded.id because your token contains {id: user._id}
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

export default authDoctor