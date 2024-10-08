import { getAuth } from 'firebase/auth';
import React, { useState } from 'react'
import {FcAddRow} from 'react-icons/fc';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import {getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from "react-router-dom";

export default function CreateProject() {
  const auth = getAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
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
    if(!images || images.length > 1){
      setLoading(false);
      toast.error("You can add only one image")
      return;
    }
    async function storeImage(image) {
      return new Promise((resolve, reject) => {
        const storage = getStorage();
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            // Handle unsuccessful uploads
            reject(error);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      });
    }

    const imgUrls = await Promise.all(
      [...images]
      .map((image) => storeImage(image)))
      .catch((error) => {
        setLoading(false);
        toast.error("Images not uploaded");
        return;
    });
    const formDataCopy={
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };
    delete formDataCopy.images;
    const docRef = await addDoc(collection(db, "ProjectList"), formDataCopy);
    setLoading(false);
    toast.success("Project Created");
    navigate(`/category/${formDataCopy.type}/${docRef.id}`);
  }

  if(loading){
    return <Spinner/>;
  }

  return (

<main className='max-w-md px-2 mx-auto'>
<h1 className='text-3xl text-center mt-6 font-bold text-blue-900'> Create New Project</h1>
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
                required
                multiple
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
