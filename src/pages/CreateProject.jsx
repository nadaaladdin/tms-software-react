import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import {FcAddRow} from 'react-icons/fc';

export default function CreateProject() {
  const auth = getAuth();
  const [formData, setFormData] = useState({
    name: "",
    numOfTasks: 0,
    numOfMembers: 0,
    description: "",
    dueDate: "",
    status: "In-Progress", // Default status is set to 'In-Progress'
    projectManager: auth.currentUser.displayName, // Project manager will be set to the name of the signed-in user
    images: null,
  });
  const {name, numOfTasks, numOfMembers, description, dueDate, status, projectManager, images} = formData;

  function onChange(e){
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }
  return (

<main className='max-w-md px-2 mx-auto'>
<h1 className='text-3xl text-center mt-6 font-bold text-blue-900'> Create New Project</h1>
<form>
    <p className='text-blue-900 text-lg mt-6 font-semibold'>Project Name</p>
    <input 
      type="text"  
      id="name" 
      value={name} 
      onChange={onChange}
      placeholder='Project Name'
      maxLength='32'
      minLength='5'
      required
      className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />
      <div className='flex space-x-6 mb-2'>
        <div>
          <p className='text-lg font-semibold text-blue-900'>Tasks</p>
          <input 
            type="number" 
            id="numOfTasks" 
            value={numOfTasks} 
            onChange={onChange}
            min='1'
            max='50'
            required
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
            />
        </div>
        <div>
          <p className='text-lg font-semibold text-blue-900'>Members</p>
          <input 
            type="number" 
            id="numOfMembers" 
            value={numOfMembers} 
            onChange={onChange}
            min='1'
            max='50'
            required
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
            />
        </div>
      </div>
      
    

    <p className='text-blue-900 text-lg mt-6 font-semibold'>Description</p>
    <textarea 
      type="text"  
      id="description" 
      value={description} 
      onChange={onChange}
      placeholder='Description...'
      maxLength='120'
      minLength='4'
      className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />
      <p className='text-blue-900 text-lg mt-6 font-semibold'>Due Date</p>
    <input 
      type="date"  
      id="dueDate" 
      value={dueDate} 
      onChange={onChange}
      required
      className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />
      <p className='text-lg font-semibold text-blue-900'>Project Status</p>
          <input 
            type="text" 
            id="status" 
            value={status} 
            disabled
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
            />
       <p className='text-lg font-semibold text-blue-900'>Project Manager</p>
          <input 
            type="text" 
            id="projectManager" 
            value={projectManager} 
            disabled
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-6'
            />

            <div className='mb-6'>
              <p className='text-lg font-semibold text-blue-900'>Project Image</p>
              <p className='text-blue-700 text-sm '>You can add a cover for the project </p>
              <input 
                type="file"
                id="images"
                onChange={onChange}
                accept='.jpg, .png, .jpeg'
                className="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600"
                />
            </div>

        <button type='submit' className=' flex justify-center items-center  py-2 w-full bg-blue-900 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-7 mb-6'>
            Create The Project
            <FcAddRow className='ml-2 text-3xl'/>
        </button>
    
    </form>
</main>   
)
}
