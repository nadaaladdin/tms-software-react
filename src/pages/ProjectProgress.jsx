import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

export default function ProjectProgressReport() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

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
      <div>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="border-b-2 border-gray-300 p-2">Name</th>
              <th className="border-b-2 border-gray-300 p-2">Due Date</th>
              <th className="border-b-2 border-gray-300 p-2">Status</th>
              <th className="border-b-2 border-gray-300 p-2">Project Manager</th>
              <th className="border-b-2 border-gray-300 p-2">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-gray-300 p-2">{projects.name}</td>
              <td className="border-b border-gray-300 p-2">{projects.status}</td>
              <td className="border-b border-gray-300 p-2">{projects.dueDate}</td>
              <td className="border-b border-gray-300 p-2">{projects.projectManager}</td>
              <td className="border-b border-gray-300 p-2">{projects.description}</td>
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
                <td className="border-b border-gray-300 p-2">{task.name}</td>
                <td className="border-b border-gray-300 p-2">{task.dueDate}</td>
                <td className="border-b border-gray-300 p-2">{task.status}</td>
                <td className="border-b border-gray-300 p-2">{task.priority}</td>
                <td className="border-b border-gray-300 p-2">{task.userName}</td>
                <td className="border-b border-gray-300 p-2">{task.projectManager}</td>
                <td className="border-b border-gray-300 p-2">{task.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
