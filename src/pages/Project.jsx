import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
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
</main>  
  )
}
