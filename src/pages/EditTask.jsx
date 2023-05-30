import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react'
import {FcAddRow} from 'react-icons/fc';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp,doc,getDoc,updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { useParams } from "react-router-dom";

  
export default function EditTask() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const params =useParams()
    const [task, setTask] =useState(null);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectID = searchParams.get('projectID');

  const [formData, setFormData] = useState({
    projID:projectID,
    name: "",
    description: "",
    dueDate: "",
    status: "In-Progress", // Default status is set to 'In-Progress'
    priority:"",
    member:"",
    projectManager: auth.currentUser.displayName, // Project manager will be set to the name of the signed-in user
    images: {},
  });
  const {projID, name, description, dueDate, status, priority,member, projectManager, images} = formData;

  useEffect(()=>{
    setLoading(true);
    async function fetchTask(){
       const docRef = doc(db, "TaskList", params.taskListId);
       const docSnap = await getDoc(docRef);
       
        if(docSnap.exists()){
            setTask(docSnap.data())
            setFormData({...docSnap.data()})
            setLoading(false)
        }else{
            navigate("/")
            toast.error("Task does not exist..")
        }
    }

    fetchTask();
  },[navigate, params.taskListId]);


  function onChange(e){
      let boolean = null;
      if (e.target.value === "true"){
        boolean  = true;
      }
      if (e.target.value === "false"){
        boolean  = false;
      }
      // for files
      if (e.target.files){
        setFormData((prevState)=>({
          ...prevState,
          images: e.target.files,
        }));
      }
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
    const docRef = doc(db, "TaskList", params.taskListId)
    
    await updateDoc(docRef, formDataCopy);
    setLoading(false);

    toast.success("Edit task is done successfully!");
    navigate("/Projects");
  }

  if(loading){
    return <Spinner/>;
  }

  return (

<main className='max-w-md px-2 mx-auto'>
<h1 className='text-3xl text-center mt-6 font-bold text-blue-900'> Edit Task</h1>
<form onSubmit={onSubmit}>
    <p className='text-blue-900 text-lg mt-6 font-semibold'>Task Name</p>
    <input 
      type="text"  
      id="name" 
      value={name} 
      onChange={onChange}
      placeholder='Task Name'
      maxLength='32'
      minLength='5'
      required
      className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />
      
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
      <p className='text-lg font-semibold text-blue-900'>Task Status</p>
          <input 
            type="text" 
            id="status" 
            onChange={onChange}
            value={status} 
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
            />

      <p className='text-lg font-semibold text-blue-900'>Task Priority</p>
          <input 
            type="text" 
            id="priority" 
            onChange={onChange}
            value={priority} 
            className='w-full text-center px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
            />

        <button type='submit' className=' flex justify-center items-center  py-2 w-full bg-blue-900 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-7 mb-6'>
            Edit The Task
            <FcAddRow className='ml-2 text-3xl'/>
        </button>
    
    </form>
</main>   
)
}
