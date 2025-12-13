import Order from "../models/order.js";

export const placeOrder = async(req, res)=>{
    try{
        const {customerName , email, phoneNumber,address,city,state,zipCode,country,productName,price,description} = req.body
        const newPlaceOrder = new placeOrder({
            customerName,
            email,
            phoneNumber, 
            address,
            city,
            state,
            zipCode,
            country,
            productName,
            price,
            description,
        })
        await newPlaceOrder.save();
        res.status(201).json({message:"Order detail saved!"})
    }
    catch(error){
        res.status(500).json({ErrorMessage:error.message})
    }
}