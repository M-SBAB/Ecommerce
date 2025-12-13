import mongoose from "mongoose";
const placeOrderSchema = new mongoose.Schema (
    {
    
       customerName:{
        type:String,
        required:true,
       },
       email:{
        type:String,
        required:true,
       },
       phoneNumber:{
        type:Number,
        required:true
       },
       address:{
        type:String,
        required:true,
       },
       city:{
        type:String,
        required:true,
       },
       state:{
        type:String,
        required:true,
       },
       zipCode:{
        type:Number,
        required:true,
       },
       country:{
        type:String,
        required:true,
       },
       productName:{
        type:String,
        required:true,
       },
       quantity:{
        type:Number,
        rewquired:true,
       },
       price:{
        type:Number,
        required:true,
       },
       description:{
        type:String,
        required:true,
       },



},
{timestamps:true}
)
const placeOrder = mongoose.model("placeOrdermodel", placeOrderSchema)
export default placeOrder