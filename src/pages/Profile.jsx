import { getAuth, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function Profile() {
  const auth =getAuth()
  const navigate = useNavigate();
  const [changeDetail, setChangeDetail] = useState(false);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const {name, email} = formData;
  function onLogout(){
    auth.signOut();
    navigate("/");
  }
  function onChange(e){
    setFormData((prevState)=> ({
      ...prevState, 
      [e.target.id]: e.target.value,
    }));
  }
  async function onSubmit(){
    try {
      if(auth.currentUser.displayName !== name){
        //update the name in firebase Auth
        await updateProfile(auth.currentUser, {
          displayName: name,
        });
        //update the name in the firestore
        const docRef=doc(db, "users",auth.currentUser.uid)
        await updateDoc(docRef, {
          name,
        });
      }
      toast.success("Profile details update")
    } catch (error) {
      toast.error("Could not update profile details")
    }
  }
  return (
    <>
      <section className='max-w-6xl mx-auto flex justify-center items-center flex-col'>
        <h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>My Profile</h1>
        <div className='w-full md:w-[50%] mt-6 px-3'>
          <form>
            {/*Name Input*/}

            <input 
              type="text" 
              id="name" 
              value={name}
              disabled={!changeDetail}
              onChange={onChange}
              className={` w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${changeDetail && "bg-green-200 focus:bg-green-200"
                        }`} 
             
             />
              {/*Email Input*/}
              <input 
              type="email" 
              id="email" 
              value={email}
              disabled
              className=" w-full mb-6 px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out"
              />
              <div className=' flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6'>
                <p className='flex items-center text-blue-900'>Do you want to change your name? 
                  <span 
                    onClick={() => {
                      changeDetail && onSubmit()
                      setChangeDetail((prevState) => !prevState)
                    }}
                    className='text-green-600 font-bold hover:text-green-900 transition duration-200 ease-in-out ml-1 cursor-pointer'> 
                    {changeDetail ? "Apply change": "Edit"}
                  </span>
                </p>
                <p onClick={onLogout} className='font-bold text-red-500 hover:text-red-700 transition duration-200 ease-in-out cursor-pointer'>Sign Out</p>
              </div>
          </form>
        </div>
      </section>
    </>
  )
}
