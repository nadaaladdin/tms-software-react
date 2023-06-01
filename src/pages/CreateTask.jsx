import { getAuth } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import { FcAddRow } from 'react-icons/fc';
import Spinner from '../components/Spinner';
import { toast } from 'react-toastify';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import {  doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';

export default function CreateTask() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [project, setProject] = useState(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const projectID = searchParams.get('projectID');

  const [formData, setFormData] = useState({
    projID: projectID,
    name: "",
    description: "",
    dueDate: "",
    status: "",
    priority: "",
    member: "",
    projectManager: auth.currentUser.displayName,
    images: {},
  });

  const { projID, name, description, dueDate, status, priority, member, projectManager, images } = formData;

  useEffect(() => {
    async function fetchUsers() {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let users = [];
      querySnap.forEach((doc) => {
        return users.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setUsers(users);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchProject() {
      if (projectID) {
        const projectRef = doc(db, "ProjectList", projectID);
        const projectDoc = await getDoc(projectRef);
        if (projectDoc.exists()) {
          setProject(projectDoc.data());
        }
      }
    }
    fetchProject();
  }, [projectID]);

  function onChange(e) {
    const { id, value, files } = e.target;

    if (id === "images") {
      setFormData((prevState) => ({
        ...prevState,
        images: files,
      }));
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);

    if (!images || images.length > 1) {
      setLoading(false);
      toast.error("You can add only one image");
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
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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
      [...images].map((image) => storeImage(image))
    ).catch((error) => {
      setLoading(false);
      toast.error("Images not uploaded");
      return;
    });

    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    };

    delete formDataCopy.images;

    const docRef = await addDoc(collection(db, "TaskList"), formDataCopy);
    setLoading(false);
    toast.success("Task Created");
    navigate(`/category/${docRef.id}`);
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <main className='max-w-md px-2 mx-auto'>
      <h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>Create New Task</h1>
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

        <div className='mb-6'>
          <p className='text-lg font-semibold text-blue-900'>Assign Member</p>
          <select
            id='member'
            value={member}
            onChange={onChange}
            className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
          >
            <option value=''>Select a member</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.data.email}
              </option>
            ))}
          </select>
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
        min={new Date().toISOString().split('T')[0]} // Set the minimum date to the current date
        max={project && project.dueDate} // Set the maximum date to the project's due date
        className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:test-gray-700 focus:bg-white focus:border-slate-600 mb-2'
      />

        <div className='mb-6'>
          <p className='text-lg font-semibold text-blue-900'>Priority</p>
          <div>
            <label className='inline-flex items-center mt-3'>
              <input
                type="radio"
                id="priority"
                value="Low"
                checked={priority === "Low"}
                onChange={onChange}
                className='form-radio h-5 w-5 text-green-600 transition duration-150 ease-in-out'
              />
              <span className='ml-2'>Low</span>
            </label>

            <label className='inline-flex items-center mt-3'>
              <input
                type="radio"
                id="priority"
                value="Medium"
                checked={priority === "Medium"}
                onChange={onChange}
                className='form-radio h-5 w-5 text-yellow-500 transition duration-150 ease-in-out'
              />
              <span className='ml-2'>Medium</span>
            </label>

            <label className='inline-flex items-center mt-3'>
              <input
                type="radio"
                id="priority"
                value="High"
                checked={priority === "High"}
                onChange={onChange}
                className='form-radio h-5 w-5 text-red-500 transition duration-150 ease-in-out'
              />
              <span className='ml-2'>High</span>
            </label>
          </div>
        </div>

        <div className='mb-6'>
              <p className='text-lg font-semibold text-blue-900'>Task Image</p>
              <p className='text-blue-700 text-sm '>You can add a cover for the task </p>
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
            Create The Task
            <FcAddRow className='ml-2 text-3xl'/>
        </button>
      </form>
    </main>
  );
}
