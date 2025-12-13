import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
    {
        productName:{
            type:String,
            required:true,
        },
        category:{
            type:String,
            required:true
        },
        price:{
            type:Number,
            required:true,
        },
        quantity:{
            type:Number,
            required:true,
        },
        description:{
            type:String,
            required:true,    
        }

    },
    {timestamps:true}
)
const Product = mongoose.model("productmodel", productSchema)
export default Product
