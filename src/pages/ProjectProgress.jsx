import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";
import {RiArrowGoBackFill} from "react-icons/ri";
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router-dom';

export default function ProjectProgressReport() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [chartData, setChartData] = useState(null);
  const auth = getAuth();

  const calculateChartData = (tasks) => {
    const taskCounts = {
      ToDo: 0,
      InProgress: 0,
      Done: 0
    };

    tasks.forEach(task => {
      if(task.status === "ToDo")
          taskCounts["ToDo"] += 1;
      else if (task.status === "In-Progress")
          taskCounts["InProgress"] += 1;
      else 
          taskCounts["Done"] += 1;
    });

    const chartData = {
      labels: Object.keys(taskCounts),
      datasetLabel: 'Tasks Status',
      datasetData: Object.values(taskCounts),
      datasetBackgroundColor: [
        'rgba( 156, 163, 175, 1)',
        'rgba( 59, 130, 246, 1)',
        'rgba( 66, 245, 209, 1)'
      ],
      datasetBorderColor: [
        'rgba( 156, 163, 175, 1)',
        'rgba( 59, 130, 246, 1)',
        'rgba( 66, 245, 209, 1)'
      ]
    };

    return chartData;
  };

  useEffect(() => {
    async function fetchProject() {
      const docRef = doc(db, "ProjectList", params.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProjects(docSnap.data());
      }
      setLoading(false);
    }

    fetchProject();
  }, [params.id]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskListRef = collection(db, 'TaskList');
        const q = query(taskListRef, where("projID", "==", params.id));
        const querySnapshot = await getDocs(q);
        
        const tasks = [];
        
        for (const docSnap of querySnapshot.docs) {
          const task = docSnap.data();
          const userId = task.member;
          
          const userDocRef = doc(db, 'users', userId);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const user = userDocSnap.data();
            const taskWithUserName = {
              ...task,
              userName: user.name
            };
            
            tasks.push(taskWithUserName);
          }
        }
        
        setTasks(tasks);
        setLoading(false);

        const chartData = calculateChartData(tasks);
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [params.id]);

  if (loading) {
    return <Spinner />;
  }
  return (
    <div className="container mx-auto mt-6 mb-4">
           {  projects && projects.userRef === auth.currentUser.uid ?(

              <div className='flex justify-between  w-full md:w-[67%] lg:w-[40%] lg:ml-20 mt-6'>
              <div className=' mb-5'>
              <button className="w-full bg-blue-500 font-medium text-sm uppercase rounded shadow-md hover:bg-blue-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-blue-500 text-white px-10 py-3"
                 type="submit">
              <Link to={`/category/${projects.type}/${params.id}`} className='flex justify-center items-center'> <RiArrowGoBackFill className="mr-2 "/>            Go Back to Project Page
                </Link>
            </button>
              </div>
              </div>
              ):null}
      <div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 p-2">Name</th>
              <th className="border-b-2 border-gray-300 p-2">Status</th>
              <th className="border-b-2 border-gray-300 p-2">Due Date</th>
              <th className="border-b-2 border-gray-300 p-2">Project Manager</th>
              <th className="border-b-2 border-gray-300 p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-gray-300 p-2 text-center border-l">{projects.name}</td>
              <td className="border-b border-gray-300 p-2 text-center border-l">{projects.status}</td>
              <td className="border-b border-gray-300 p-2 text-center w-32 border-l">{projects.dueDate}</td>
              <td className="border-b border-gray-300 p-2 text-center border-l">{projects.projectManager}</td>
              <td className="border-b border-gray-300 p-2 w-80 border-r border-l">{projects.description}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 p-2">Name</th>
              <th className="border-b-2 border-gray-300 p-2">Due Date</th>
              <th className="border-b-2 border-gray-300 p-2">Status</th>
              <th className="border-b-2 border-gray-300 p-2">Priority</th>
              <th className="border-b-2 border-gray-300 p-2">Member</th>
              <th className="border-b-2 border-gray-300 p-2">Project Manager</th>
              <th className="border-b-2 border-gray-300 p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="border-b border-gray-300 p-2 text-center border-l">{task.name}</td>
                <td className="border-b border-gray-300 p-2 text-center border-l">{task.dueDate}</td>
                <td
                  className={`border-b border-gray-300 p-2 text-center border-l ${
                    task.status === "Done"
                      ? "bg-teal-400"
                      : task.status === "ToDo"
                      ? "bg-gray-400"
                      : task.status === "In-Progress"
                      ? "bg-blue-500"
                      : ""
                  }`}
                >
                  {task.status}
                </td>
                <td
                  className={`border-b border-gray-300 p-2 text-center border-l ${
                    task.priority === "Low"
                      ? "bg-green-500"
                      : task.priority === "High"
                      ? "bg-red-400"
                      : "bg-yellow-300"
                  }`}
                >
                  {task.priority}
                </td>
                <td className="border-b border-gray-300 p-2 text-center border-l">{task.userName}</td>
                <td className="border-b border-gray-300 p-2 text-center border-l">{task.projectManager}</td>
                <td className="border-b border-gray-300 p-2 border-r border-l">{task.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
