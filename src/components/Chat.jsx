import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams } from "react-router-dom";
import { addDoc, onSnapshot, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FcManager,FcBusinessman } from "react-icons/fc";

const Chat = () => {
  const [managerMessage, setManagerMessage] = useState('');
  const [memberMessage, setMemberMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const auth = getAuth();
  const params = useParams();
  const [AssignedMember, setAssignedMember] = useState('');
  const [projectManager,setProjectManager] =useState('');
  
  useEffect(() => {
    const messagesCollectionRef = collection(db, 'messages');
    const unsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function fetchTask() {
      const taskRef = doc(db, 'TaskList', params.id);
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        const taskData = docSnap.data();
        setAssignedMember(taskData.member);
        setProjectManager(taskData.userRef);
      } else {
        console.log('Task not found');
      }
    }
    fetchTask();
  }, [params.id]);

  const handleManagerInputChange = (e) => {
    setManagerMessage(e.target.value);
  };

  const handleMemberInputChange = (e) => {
    setMemberMessage(e.target.value);
  };

  const handleManagerSendMessage = async () => {
    if (managerMessage.trim() !== '') {
      const message = {
        sender: 'manager',
        content: managerMessage,
      };
      try {
        await addDoc(collection(db, 'messages'), message);
        setManagerMessage('');
      } catch (error) {
        console.error('Error adding message: ', error);
      }
    }
  };

  const handleMemberSendMessage = async () => {
    if (memberMessage.trim() !== '') {
      const message = {
        sender: 'member',
        content: memberMessage,
      };
      try {
        await addDoc(collection(db, 'messages'), message);
        setMemberMessage('');
      } catch (error) {
        console.error('Error adding message: ', error);
      }
    }
  };

  return (
    <div className="bg-white mx-auto flex justify-center items-center flex-col max-w-6xl p-4 rounded-lg shadow-lg mt-2">
      <h2 className="text-2xl font-bold mb-2">Communication Box</h2>
      <div className="flex flex-col w-full max-w-lg">

      { projectManager=== auth.currentUser.uid ? (
        <div className="flex border p-2 mb-2">
          <input
          type="text"
          placeholder="Manager message"
          className="flex-grow mr-2 border-2 border-gray-300 p-2 rounded"
          value={managerMessage}
          onChange={handleManagerInputChange}
        />
          
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            onClick={handleManagerSendMessage}
          >
            Send
          </button>
        </div>
        ):null}
     { AssignedMember === auth.currentUser.uid?(
        <div className="flex border p-2 mb-2">
          <input
            type="text"
            placeholder="Member message"
            className="flex-grow mr-2 border-2 border-gray-300 p-2 rounded"
            value={memberMessage}
            onChange={handleMemberInputChange}
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
            onClick={handleMemberSendMessage}
          >
            Send
          </button>
        </div>
      ):null}
        <div className="flex flex-col">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`bg-gray-100 p-2 rounded mb-2 ${
                msg.sender === 'manager' ? 'text-left' : 'text-right'
              }`}
            >
              <span className="font-bold">
                {msg.sender === 'manager' ? <FcBusinessman className='text-2xl'/> : <FcManager className='flex ml-auto text-2xl'/>}
              </span>{' '}
              {msg.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chat;
