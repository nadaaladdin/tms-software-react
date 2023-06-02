import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams } from 'react-router-dom';
import { addDoc, onSnapshot, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { toast } from 'react-toastify';
import { MdNotificationsActive } from 'react-icons/md';
import { FaTrashAlt } from 'react-icons/fa';

const Contact = () => {
  const [notificationList, setNotificationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Added state to control menu visibility

  const auth = getAuth();
  const params = useParams();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const notificationRef = collection(db, 'notifications');
        const q = query(notificationRef, where('member', '==', auth.currentUser.uid));
        const querySnap = await getDocs(q);
        let notificationList = [];
        querySnap.forEach((doc) => {
          notificationList.push({
            id: doc.id,
            data: doc.data(),
          });
        });
        setNotificationList(notificationList);
        console.log(notificationList);

        setLoading(false);
      } catch (error) {
        // Handle error
      }
    };
    fetchTasks();
  }, []);

  const handleNotificationClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteDoc(doc(db, 'notifications', notificationId));
      toast.success('Notification deleted successfully');
    } catch (error) {
      // Handle error
      toast.error('Failed to delete notification');
    }
  };

  return (
    <div className="fixed top-14 right-4 z-50">
      <h2 className="flex ml-2 text-2xl font-bold mb-2" onClick={handleNotificationClick}>
        <MdNotificationsActive
          className={`ml-2 text-3xl ${notificationList.length ? 'text-red-500' : 'text-blue-900'}`}
        />
      </h2>

      {isMenuOpen && (
        <div className="bg-white rounded-lg shadow-lg p-4 absolute right-0 mt-2 w-80">
          {notificationList.length === 0 ? (
            <p className="text-xl font-semibold text-blue-900">You do not have notifications</p>
          ) : (
            <ul className="text-xl font-semibold text-blue-900">
              {notificationList.map((notification, index) => (
                <li key={index} className="p-2 mb-2 bg-gray-200 rounded-md flex items-center">
                  <span className="mr-2 text-lg ">You have a new task:</span>
                  <span className="text-lg">{notification.data.name}</span>
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="ml-2 text-xs text-red-500"
                  >
                    <FaTrashAlt />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Contact;
