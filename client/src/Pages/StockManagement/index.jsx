import React, { useEffect, useState } from 'react';
import { Package } from 'lucide-react';
import { useForm } from 'react-hook-form';



export default function StockUpdate() {
    const {register, handleSubmit, reset, formState:{errors}} = useForm()
  
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleUpdate = () => {
    console.log('Updating stock:', { productName, quantity });
    setProductName('');
    setQuantity('');
  };


  const [products, setProducts] = useState(null)

  const getAllProducts = async()=>{
    const res = await fetch("http://localhost:5000/products/all",{
      method:"GET"
    })
    const response = await res.json({})
    // console.log(response)
    if(response.products){
      setProducts(response.products)
    }
    else if(response.ErrorMessage){
      alert(response.ErrorMessage)
    }
  }

  const updatestock= async(data)=>{
    const res= await fetch(`http://localhost:5000/products/${data.ProductId}/Update`,{
      method:"PATCH",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({stock:data.UpdateStock})

    })
    const response = await res.json()
    console.log(response)

    // console.log(data.ProductId , data.UpdateStock)
  }

  useEffect(()=>{
      getAllProducts()
  },[])

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-light text-gray-900">Stock Update</h1>
          </div>
          <div className="h-0.5 w-16 bg-gray-900"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(updatestock)}>
        <div className="bg-white border border-gray-200 rounded-lg p-8">
          <div className="space-y-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
            <select name="" id="" className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900'
                            {...register("ProductId",{required:true})}

            
            >
             
              {products?.map((product)=>(
                <option value={product._id}>{product.productName}</option>
              ))}
            </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity
              </label>
              <input
                type="number"
               
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Enter quantity"
                {...register("UpdateStock",{required:true})}

              />
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdate}
              className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Update Stock
            </button>
          </div>
        </div>
          </form>

      </div>
    </div>
  );
}