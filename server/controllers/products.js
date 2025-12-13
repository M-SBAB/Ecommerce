import Product from "../models/products.js"

export const addProduct = async(req, res)=>{

    try{
        const {productName,category,price,quantity,description} = req.body
        const newAddProduct = new Product({
            productName: productName,
            category,
            price,
            quantity,
            description
        })
        await newAddProduct.save()
        res.status(201).json({message:"Product Added!"})
        // res.json({productName, category, price, quantity, description})

    }
    catch(error){
     res.status(500).json({ErrorMessage:error.message})
    }
}

export const getAllProduct = async(req,res)=>{
    try{
            const products = await Product.find()
            if(!products){
                return res.json({ErrorMessage:"No products"})
            }
            res.status(200).json({products})
    }catch(error){
        res.status(500).json({ErrorMessage:"Error getting all products!"})
    }
}


// update product function 

export const updateStock = async(req,res)=>{
    try{
        const {productID} = req.params
        const {stock} = req.body
        const product = await Product.findOne({_id:productID })

        if(!product) res.json({eroorMessage:"product not found"})

        const quantity = product.quantity

        const updatedQuantity = quantity + Number(stock)
        await Product.findByIdAndUpdate(
            productID,
            {quantity:updatedQuantity},
            {new:true}
        )

        res.status(201).json({message:"Stock updated!"})

        // res.json({productID, stock})
    }
    catch(error)
    {
        res.json({errorMessage:error.message})
    }
}



