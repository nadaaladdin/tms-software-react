import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Spinner from "../components/Spinner";

export default function ProjectProgressReport() {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [taskList, setTaskList] = useState([]);
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
    async function fetchProjectTasks() {
      const taskRef = collection(db, "TaskList");
      const q = query(
        taskRef,
        where("projID", "==", params.id),
        orderBy("timestamp", "desc")
      );
      const querySnap = await getDocs(q);
      let taskList = [];
      querySnap.forEach((doc) => {
        return taskList.push({
          id: doc.id,
          data: doc.data(),
        });
      });
      setTaskList(taskList);
      setLoading(false);
    }

    fetchProjectTasks();
  }, [params.id]);


  useEffect(() => {
    async function fetchUsers() {
      if (taskList.length > 0) {
        const memberIds = taskList.map((task) => task.data.member);
        const usersRef = collection(db, "users");
        const querySnap = await getDocs(usersRef);
        let users = [];
        querySnap.forEach((doc) => {
          if (memberIds.includes(doc.id)) {
            users.push({
              id: doc.id,
              data: doc.data(),
            });
          }
        });
        setUsers(users);
      }
      setLoading(false);
    }

    fetchUsers();
  }, [taskList]);
  

  if (loading) {
    return <Spinner />;
  }
 
  console.log(users)
  
  return (
    <div className="container mx-auto">
      {/* Render project information */}
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

      {/* Render task list */}
      <div className="container mx-auto">
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
            {taskList.map((task) => (
              <tr key={task.id}>
                <td className="border-b border-gray-300 p-2">{task.data.name}</td>
                <td className="border-b border-gray-300 p-2">{task.data.dueDate}</td>
                <td className="border-b border-gray-300 p-2">{task.data.status}</td>
                <td className="border-b border-gray-300 p-2">{task.data.priority}</td>
                <td className="border-b border-gray-300 p-2">
                {users.find((user) => user.id === task.data.member)?.data.member}  </td>
                <td className="border-b border-gray-300 p-2">{task.data.projectManager}</td>
                <td className="border-b border-gray-300 p-2">{task.data.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
