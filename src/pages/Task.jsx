import { doc, getDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrStatusGood } from "react-icons/gr";
import Spinner from "../components/Spinner";
import { FcManager, FcCalendar,FcBusinessman } from "react-icons/fc";
import { MdDescription,MdWorkHistory } from "react-icons/md";
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from "swiper";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";
import { FcLowPriority, FcHighPriority, FcMediumPriority } from "react-icons/fc";

export default function Task() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [memberName, setMemberName] = useState('');
  const [projectName, setProjectName] = useState('');

  const navigate = useNavigate();

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
          } else {
            setProjectName('Unknown User');
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

      <div className="bg-white mx-auto flex justify-center items-center flex-col max-w-6xl p-4 rounded-lg shadow-lg mt-2">
        <div className="mx-auto flex-1 bg-blue-300 w-full h-[400px] lg-[400px] rounded-lg">
          <p className="ml-5 text-4xl font-bold mt-4 mb-6 text-green-700">
            {task.name}
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcBusinessman className="mr-2 text-3xl" />
            Project Manager:
            <span className="text-green-700 ml-2">{task.projectManager}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcManager className="mr-2 text-3xl" />
            Assigned Member:
            <span className="text-green-700 ml-2">{memberName}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <MdWorkHistory className="mr-2 text-3xl text-black" />
            Project Name:
            <span className="text-green-700 ml-2">{projectName}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold text-blue-800">
            <MdDescription className="text-yellow-600 mr-2 sm:text-4xl" />
            Description:
            <span className="text-green-700 ml-2">{task.description}</span>
          </p>

          <p className="flex ml-6 text-2xl font-bold mb-3 text-blue-800">
            {task.priority === "high" ? (
              <FcHighPriority className="mr-1 sm:text-4xl" />
            ) : null}
            {task.priority === "low" ? (
              <FcLowPriority className="mr-1 sm:text-4xl" />
            ) : null}
            {task.priority === "Medium" ? (
              <FcMediumPriority className="mr-1 sm:text-4xl" />
            ) : null}
            Priority:
            <span
              className={`ml-1 ${
                task.priority === "low"
                  ? "text-green-500"
                  : task.priority === "normal"
                  ? "text-blue-500"
                  : "text-red-500"
              }`}
            >
              {task.priority}
            </span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <GrStatusGood className="text-yellow-600 mr-2 text-3xl" />
            Task Status:
            <span className="text-green-700 ml-2">{task.status}</span>
          </p>

          <p className="flex ml-5 text-2xl font-bold mb-3 text-blue-800">
            <FcCalendar className="mr-2 text-3xl" />
            Due Date:
            <span className="text-green-700 ml-2">{task.dueDate}</span>
          </p>
        </div>
      </div>
    </main>
  );
}
