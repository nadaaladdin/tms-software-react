import { getAuth } from 'firebase/auth';
import React, { useEffect, useState } from 'react'
import {FcAddRow} from 'react-icons/fc';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {
    addDoc,
    collection,
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
  } from "firebase/firestore";

import { db } from '../firebase';
import { useNavigate, useParams } from "react-router-dom";

export default function EditProject() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    numOfTasks: 0,
    numOfMembers: 0,
    description: "",
    dueDate: "",
    status: "In-Progress", // Default status is set to 'In-Progress'
    projectManager: auth.currentUser.displayName, // Project manager will be set to the name of the signed-in user
    images: {},
  });
  const {name, numOfTasks, numOfMembers, description, dueDate, status, projectManager, images} = formData;

  const params =useParams()

  useEffect(()=>{
    if(project && project.userRef !== auth.currentUser.uid){
        toast.error("You can not edit this project!")
        navigate("/")
    }
  }, [auth.currentUser.uid, project, navigate]);

  useEffect(()=>{
    setLoading(true);
    async function fetchProject(){
        const docRef = doc(db, "ProjectList", params.projectID)
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            setProject(docSnap.data())
            setFormData({...docSnap.data()})
            setLoading(false)
        }else{
            navigate("/")
            toast.error("Project does not exist..")
        }

    }
    fetchProject();
  },[navigate, params.projectID]);


  function onChange(e){
      let boolean = null;
      if (e.target.value === "true"){
        boolean  = true;
      }
      if (e.target.value === "false"){
        boolean  = false;
      }
      // for files
 
      //text,bool,number
      if(!e.target.files){
        setFormData((prevState)=>({
          ...prevState,
          [e.target.id]: boolean ?? e.target.value,
        }));
      }
  }
  async function onSubmit(e){
    e.preventDefault(); //prevent refresh the page
    setLoading(true);

    const formDataCopy={
      ...formData,
      //imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    const docRef = doc(db, "ProjectList", params.projectID)
    
    await updateDoc(docRef, formDataCopy);
    setLoading(false);

    toast.success("Edit project is done successfully!");
    navigate("/Projects");
  }

  if(loading){
    return <Spinner/>;
  }

  return (

<main className='max-w-md px-2 mx-auto'>
<h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>  Edit Project</h1>
<form onSubmit={onSubmit}>
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
      min={new Date().toISOString().split('T')[0]} // Set the minimum date to the current date
      className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />
      <p className='text-lg font-semibold text-blue-900'>Project Status</p>
          <input 
            type="text" 
            id="status" 
            value={status} 
            onChange={onChange}

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

        <button type='submit' className=' flex justify-center items-center  py-2 w-full bg-blue-900 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-7 mb-6'>
            Edit The Project
            <FcAddRow className='ml-2 text-3xl'/>
        </button>
    
    </form>
</main>   
)
}
