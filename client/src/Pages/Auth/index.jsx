import { SpaceIcon } from 'lucide-react';
import React from 'react'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {useNavigate} from "react-router-dom"


const Auth = () => {
  const {register, handleSubmit, reset, formState:{errors}} = useForm()
  const [form,setForm] = useState("login")
  const Navigate = useNavigate()



  const loginUser  = async(data)=>{
          const res = await fetch ("http://localhost:5000/auth/login",{
              method:"POST",
              headers:{
                "Content-Type":"application/json"
              },
              body:JSON.stringify({username:data.loginusername,password:data.loginPassword})         

          })
          const response = await res.json()
          // console.log(response)
          if(response.user){
            Navigate("/dashboard")
          }
          else if(response.ErrorMessage){
            alert(response.ErrorMessage)
          }

  }
   const signUpUser  = async(data)=>{
          const res = await fetch("http://localhost:5000/auth/signup",{
            method:"POST",
            headers:{
              "Content-Type":"application/json"
            },
            body:JSON.stringify({username:data.signUpusername, password:data.signUpPassword})
          })
          const response = await res.json()
          console.log(response)
          alert("data saved successfully")
        
  }



  return (
    <div  className='h-screen flex justify-center items-center '>
     {form==="login" && (
      <form onSubmit={handleSubmit(loginUser)} >
       <div className='h-[200px] w-[200px] border bg-white '>
        <input type="text" placeholder='username' required  className='border rounded' 
        {...register("loginusername",{required:true})}
        />
         {errors.loginEmail && <span>whis field is requiered</span>}

        <input type="text" placeholder='password' required className='border rounded'
        {...register("loginPassword",{required:true})}
        />
        <button className='bg-green-500 border rounded '>Login</button>
      <button className='underline' onClick={()=>setForm("register")}>Register Account</button>
      </div>
     </form>
     )}

    
     {form==="register" && (
       
       <form onSubmit={handleSubmit(signUpUser)}>
         <div className='h-[200px] w-[200px] border bg-white  '>
        <input type="text" placeholder='username' required  className='border rounded'
        {...register("signUpusername" ,{required:true})}
        />
        <input type="text" placeholder='password' required className='border rounded'
        {...register("signUpPassword",{required:true})}
        />
        <button className='bg-green-500 border rounded'>Register</button>
      <button className='underline ' onClick={()=>setForm("login")}>Go to login</button>
      </div>
       </form>

        )}


    </div>
  )
}

export default Auth