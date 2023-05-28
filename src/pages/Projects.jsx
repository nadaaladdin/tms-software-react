import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import {FcAddImage} from 'react-icons/fc';

// import { icons } from 'react-icons/lib';
import { Timestamp, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { getAuth } from 'firebase/auth';
import ListingItem from "../components/ListingItem";
import { toast } from 'react-toastify';

export default function Projects() {
  const navigate = useNavigate();
  const auth=getAuth();
  const [ProjectList, setProjectList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });
  useEffect(()=>{
    async function fetchUserProjects(){
        const projectsRef = collection(db, "ProjectList");
        const q = query(
          projectsRef, 
          where("userRef", "==", auth.currentUser.uid), 
          orderBy("timestamp","desc"));
        const querySnap =await getDocs(q);
        let ProjectList =[];
        querySnap.forEach((doc)=>{
          return ProjectList.push({
            id: doc.id,
            data: doc.data(),
          });
        });
       // console.log("list",ProjectList)
        setProjectList(ProjectList);
        setLoading(false);
      }
      fetchUserProjects();
  }, [auth.currentUser.uid])


  async function onDelete(projectListID){
    if(window.confirm("Are you sure? you want delete the project?")){
      await deleteDoc(doc(db, "ProjectList", projectListID))
      const updatedListing =ProjectList.filter(
        (project)=> project.id !== projectListID
      );
      setProjectList(updatedListing)
      toast.success("Project is deleted successfully..")
    }
  }

  function onEdit(projectListID){
    navigate(`/edit-project/${projectListID}`);
  }
  return (
    <>
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>
        Projects
      </h1>

      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img  src='https://www.meistertask.com/blog/wp-content/uploads/2021/02/MT_fortaskmanagement_header-796x398.png' 
                alt='task' 
                className='w-full rounded-xl'/>
        </div>


      <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>

        <div className=' mb-5'>
        <button className="w-full bg-red-500 font-medium text-sm uppercase rounded shadow-md hover:bg-red-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-500 text-white px-7 py-3"
                type="submit">
                <Link to="/create-project" className='flex justify-center items-center '>
                <FcAddImage className='mr-2 text-3xl ' />
                   Create New project
                  </Link>
          </button>
        </div>

      </div>

    </div>
    </section>
    <div className='max-w-6xl px-3 mt-6 mx-auto'>
      {!loading && ProjectList.length > 0 && ( 
        <>
          <h2 className='text-2xl text-center  font-semibold text-blue-900'>
            My Projects
          </h2>
          <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl-grid-cols-4 2xl-grid-cols-5 mt-6 mb-6' >
            {ProjectList.map((projectList)=>(
              <ListingItem 
                key={projectList.id}
                id={projectList.id}
                projectList={projectList.data}
                onDelete={()=>onDelete(projectList.id)}
                onEdit={()=>onEdit(projectList.id)}

                />
            ))}
          </ul>
        </>
      )}
    </div>
</>
  );
}