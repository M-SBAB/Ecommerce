import User from "../models/user.js";

export const signupUser = async(req, res)=>{
    try{
        const {username , password} = req.body
        const newUser = new User({
            username,
            password 
        })
        await newUser.save();
        res.status(201).json({message:"user saved!"})
    }
    catch(error){
        res.status(500).json({ErrorMessage:error.message})
    }
}


export const loginUser = async(req,res)=>{
    try{
        const {username,password}=req.body
        
        const user = await User.findOne({username})
        if(!user) return res.status(404).json({ErrorMessage:"User is not found!"})

            const isMatch = user.password === password
        if(!isMatch) return res.status(404).json({ErrorMessage:"wrong username/password"})
            res.status(200).json({user})

    }
    catch(error){
        res.status(500).json({ErrorMessage:"Error Logging In !"})
    }
}
