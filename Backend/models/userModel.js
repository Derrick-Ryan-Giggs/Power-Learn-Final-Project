import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    password:{type:String, required:true},
    image:{type:String, default:"data:image/png;base64,..."},
    address: {type:Object,default:{line1:'',line2:''}},
    gender:{type:String,default:"Not Selected"},
    Dob:{type:String,default:"Not Selected"},
    phone:{type:String,default:"0000000000"},
})

// Export the model, not the schema
const userModel = mongoose.models.user || mongoose.model('user', userSchema)

export default userModel