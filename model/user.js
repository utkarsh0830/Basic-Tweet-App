import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true
        
    },
    password: {
        type: String,
        required: [true,"Password is required"]

    },
    refreshTokens: {
        type: String,
    }
},{timestamps: true})

userSchema.pre("save",async (next)=>{

    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async (password)=>{
    return bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = async () => {
    return await jwt.sign({
        _id: this._id,
        email: email,
        username: username,
        name: name
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
)}

userSchema.methods.generateRefreshToken = async ()=>{
    return await jwt.sign(
        {
            _id: this.id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model('User',userSchema);