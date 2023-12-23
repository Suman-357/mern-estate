import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
            username:{
                type:String,
                required:true,
                unique:true
            },
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true,
            },
            avatar:{
                type:String,
                defalut:"https://lh3.googleusercontent.com/a/ACg8ocK-fJWk9l_SvceM8vklGB2z9PLhJ6U9IzQ08FaqOhGI=s96"
            },
}, { timestamps: true });

const user =  mongoose.model("user", userSchema);

export default user;