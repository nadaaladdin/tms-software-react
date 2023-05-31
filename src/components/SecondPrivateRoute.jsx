import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
// import { toast } from 'react-toastify';

export default function SecondPrivateRoute() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const taskRef = collection(db, "TaskList");
        const q = query(taskRef,
             where("member", "==", auth.currentUser.uid) ||
             where("userRef", "==", auth.currentUser.uid));
        const querySnap = await getDocs(q);
        let taskList = [];
        querySnap.forEach((doc) => {
          taskList.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        console.log(taskList);
        setLoading(false);

        if (taskList.length > 0) {
          console.log("test 11");
          // toast.success("Hello from the other side");
          console.log(auth.currentUser.uid);
          // Set state or perform any action here
        } else {
          console.log("test 22");
          // Set state or perform any action here
        }
      } catch (error) {
        // Handle error
      }
    };

    fetchTasks();
  }, []);
/*
  if (loading) {
    // Optional: Show a loading spinner or message
    return <div>Loading...</div>;
  }
*/
  return <Outlet />;
}
