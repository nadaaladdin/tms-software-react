import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrStatusGood } from "react-icons/gr";
import Spinner from "../components/Spinner";
import { FcManager, FcCalendar,FcBusinessman } from "react-icons/fc";
import { MdDescription,MdWorkHistory,MdEditNote } from "react-icons/md";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
import { FcLowPriority, FcHighPriority, FcMediumPriority } from "react-icons/fc";
import { Link } from 'react-router-dom';
import {RiArrowGoBackFill} from "react-icons/ri"
import { getAuth } from 'firebase/auth';
import Chat from "../components/Chat";


export default function Task() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDueDate, setProjectDueDate] = useState('');
  const [projectType, setProjectType] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  SwiperCore.use([Autoplay, Navigation, Pagination]);

  useEffect(() => {
    setLoading(true);
    async function fetchTask() {
      const taskDocRef = doc(db, 'TaskList', params.id);
      const taskDocSnap = await getDoc(taskDocRef);

      if (taskDocSnap.exists()) {
        const taskData = taskDocSnap.data();
        setTask(taskData);

        // Fetch the user's name
        const userDocRef = doc(db, 'users', taskData.member);
        const projectDocRef = doc(db, 'ProjectList', taskData.projID);
        const userDocSnap = await getDoc(userDocRef);
        const projectDocSnap = await getDoc(projectDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setMemberName(userData.name);
        } else {
          setMemberName('Unknown User');
        }

        if (projectDocSnap.exists()) {
            const userData = projectDocSnap.data();
            setProjectName(userData.name);
            setProjectDueDate(userData.dueDate);
            setProjectType(userData.type);
          } else {
            setProjectName('Unknown User');
            setProjectType ('undefine')
          }

        setLoading(false);
      } else {
        navigate('/');
        toast.error('Task does not exist..');
      }
    }

    fetchTask();
  }, [navigate, params.id]);


  if (loading) {
    return <Spinner />;
  }

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation={false}
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade]}
        autoplay={{ delay: 3000 }}
      >
        {task.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative  w-full overflow-hidden h-[300px]"
              style={{
                background: `url(${task.imgUrls[index]}) center no-repeat`,
                backgroundSize: "cover"
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>


      <div className='flex justify-between  w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-6'>
    <div className=' mb-5'>
        <button className="w-full bg-red-500 font-medium text-sm uppercase rounded shadow-md hover:bg-red-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-500 text-white px-10 py-3"
                type="submit">
      <Link to={`/edit-task/${params.id}`} className='flex justify-center items-center'>  <MdEditNote className="mr-2 text-xl"  />          Edit Task
               </Link>
          </button>
    </div>
     </div>
     {  task && task.userRef === auth.currentUser.uid ?(

     <div className='flex justify-between  w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-6'>
     <div className=' mb-5'>
         <button className="w-full bg-blue-500 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-10 py-3"
                 type="submit">
          
       <Link to={`/category/${projectType}/${task.projID}`} className='flex justify-center items-center'> <RiArrowGoBackFill className="mr-2 "/>            Go Back to Project Page
                </Link>
           </button>
     </div>
      </div>
     ):null}

     <div className='flex justify-between  w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-6'>
          <div className=' mb-5'>
                <button  className="w-full bg-yellow-500 font-medium text-sm uppercase rounded shadow-md hover:bg-yellow-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-yellow-500 text-white px-10 py-3">
                    Contact
                </button>
            </div>
      </div>

      <div className="bg-white mx-auto flex justify-center items-center flex-col max-w-6xl p-4 rounded-lg shadow-lg mt-2">
        <div className="mx-auto flex-1 bg-blue-300 w-full h-[400px] lg-[400px] rounded-lg">
          <p className="ml-5 text-4xl font-bold mt-4 mb-6 text-black">
            {task.name}
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcBusinessman className="mr-2 text-3xl" />
            Project Manager:
            <span className="text-black ml-2">{task.projectManager}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcManager className="mr-2 text-3xl" />
            Assigned Member:
            <span className="text-black ml-2">{memberName}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <MdWorkHistory className="mr-2 text-3xl text-black" />
            Project Name:
            <span className="text-black ml-2">{projectName}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold text-blue-800">
            <MdDescription className="text-yellow-600 mr-2 sm:text-4xl" />
            Description:
            <span className="text-black ml-2">{task.description}</span>
          </p>

          <p className="flex ml-6 text-2xl font-bold mb-3 text-blue-800">
            {task.priority === "High" ? (
              <FcHighPriority className="mr-1 sm:text-4xl" />
            ) : null}
            {task.priority === "Low" ? (
              <FcLowPriority className="mr-1 sm:text-4xl" />
            ) : null}
            {task.priority === "Medium" ? (
              <FcMediumPriority className="mr-1 sm:text-4xl" />
            ) : null}
            Priority:
            <span
              className={`ml-1 ${
                task.priority === "Low"
                  ? "text-green-500"
                  : task.priority === "Medium"
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {task.priority}
            </span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <GrStatusGood className="text-yellow-600 mr-2 text-3xl" />
            Task Status:
            <span className="text-black ml-2">{task.status}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcCalendar className="mr-2 text-3xl" />
            Due Date:
            <span className="text-black ml-2">{task.dueDate}</span>
          </p>
        </div>
      </div>
      <Chat/>
    </main>
  );
}
