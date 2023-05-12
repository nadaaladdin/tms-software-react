import React, { useState } from 'react'
import {AiFillEyeInvisible, AiFillEye} from "react-icons/ai"
import { Link } from 'react-router-dom';
import OAuth from '../components/OAuth';

export default function SingUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData]=useState({
    name:"",
    email: "",
    password: "",
  });
  const {name, email, password} = formData;

  function onChange(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>
        Sign Up
      </h1>
      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img  src='https://cdn4.meistertask.com/assets/svgs/lead-magnet-1-d7e395a5bcdadcc49d4d2585bc9c35cee4a109c8eb9c6621601d09254d5e1d1f.svg' 
                alt='task' 
                className='w-full rounded-xl'/>
        </div>
        <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>
          <form >
          <input 
                type="text"
                id="name" 
                value={name} 
                onChange={onChange} 
                placeholder='Full Name'
                className=" mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            <input 
                type="email"
                id="email" 
                value={email} 
                onChange={onChange} 
                placeholder='Email Address'
                className=" mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"
            />
            <div className="relative mb-6"> 
              <input 
                type={showPassword? "text": "password"} 
                id="password" 
                value={password} 
                onChange={onChange} 
                placeholder='Password'
                className="w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out"/>
                {showPassword ?
                (<AiFillEye className= "absolute right-3 top-3 text-xl cursor-pointer" 
                onClick={()=>setShowPassword((prevState)=>!prevState)}
                />)  :(<AiFillEyeInvisible  
                className= "absolute right-3 top-3 text-xl cursor-pointer" 
                onClick={()=>setShowPassword((prevState)=>!prevState)}/>
                )}
          </div>    
              <div className='flex justify-between whitespace-nowrap text-sm sm:text-lg'>
                <p className=' mb-6 text-blue-900'>Have an account yet?
                  <Link to='/sign-in' className='text-red-500  hover:text-red-700 transition duration-200 ease-in-out  font-bold ml-1'> Sign In   </Link>
                </p>

              </div>
              <button className="w-full bg-blue-900 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-7 py-3"
                type="submit">Sign UP</button>
                          <div className='my-4 before:border-t flex before:flex-1 items-center before:border-gray-400 after:border-t  
                          after:flex-1  after:border-gray-400'>
            <p className='text-center font-semibold mx-4 text-green-600'>OR</p>
          </div>
                <OAuth />
        </form>
        </div>
      </div>
    </section>
  )
}
