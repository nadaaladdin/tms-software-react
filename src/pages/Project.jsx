import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import {GrStatusGood} from "react-icons/gr";
import {RiTeamFill} from "react-icons/ri";
import {FcManager, FcCalendar} from "react-icons/fc";
import {FaTasks} from "react-icons/fa"
import {MdDescription} from "react-icons/md"
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import {
  FaShare,
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaChair,
} from "react-icons/fa";
import { getAuth } from "firebase/auth";



  export default function Project() {
    const params = useParams()
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    SwiperCore.use([Autoplay, Navigation, Pagination]);

    useEffect(()=>{
        async function fetchProject(){
            const docRef = doc(db, "ProjectList", params.projectID)
            const docSnap = await getDoc(docRef)
            if(docSnap.exists()){
                setProject(docSnap.data())
                setLoading(false)
            }
        }
        fetchProject();

    },[params.projectID])
    if(loading){
        return <Spinner/>;
    }
  return (
<main>
    <Swiper slidesPerView={1} navigation={false} pagination={{type: "progressbar"}}
            effect='fade' modules={[EffectFade]} autoplay={{delay: 3000}}>
        {project.imgUrls.map((url, index)=>(
            <SwiperSlide key={index}>
                <div 
                    className='relative  w-full overflow-hidden h-[300px]'
                    style={{
                        background: `url(${project.imgUrls [index]}) center no-repeat`,
                        backgroundSize: "cover"
                        }}>
                </div>
            </SwiperSlide>
        ))}
    </Swiper>

    <div className="bg-white mx-auto flex justify-center items-center flex-col max-w-6xl p-4 rounded-lg shadow-lg mt-7">
      <div className="mx-auto flex-1 bg-blue-300 w-full h-[400px] lg-[400px] rounded-lg">
         <p className=" ml-5 text-4xl font-bold mt-4 mb-6 text-green-700">
            {project.name} 
         </p>

         <p className=" flex ml-5 text-2xl font-bold mb-3 text-blue-800" >         
         <FcManager className='mr-2 text-3xl'/>
          Project Manager: 
          <span className="text-green-700 ml-2">
               {project.projectManager}
          </span>
         </p>

         <p className="flex ml-5 text-2xl font-bold text-blue-800" >
         <MdDescription className='text-yellow-600 mr-2 sm:text-4xl'/>
          Description: 
          <span className="text-green-700 ml-2">
              {project.description}
          </span>
         </p>

         <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800" >
         <GrStatusGood className='text-yellow-600 mr-2 text-3xl'/>
          Project Status: 
          <span className="text-green-700 ml-2">
             {project.status}
          </span>
         </p>

         <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800" >
          <FcCalendar className='mr-2 text-3xl'/>
          Due Date: 
          <span className="text-green-700 ml-2">
              {project.dueDate}
          </span>
         </p>

         <p className=" flex ml-5 text-2xl font-bold mb-3 text-blue-800" >
         <FaTasks className='text-black mr-2 text-3xl'/>
          Number of tasks:  
         <span className="text-green-700 ml-2">
                {project.numOfTasks}
          </span>
         </p>

         <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800" >
         <RiTeamFill className='text-black mr-2 text-3xl'/>
          Number of members: 
          <span className="text-green-700 ml-2">
              {project.numOfTasks}
          </span>
        
         </p>

      </div>
    </div>
</main>  
  )
}
