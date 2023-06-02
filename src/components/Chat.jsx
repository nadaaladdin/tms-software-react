import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useParams } from "react-router-dom";
import { addDoc, onSnapshot, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FcManager, FcBusinessman } from "react-icons/fc";
import { toast } from "react-toastify";
import { AiOutlineWechat } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";

const Chat = () => {
  const [managerMessage, setManagerMessage] = useState('');
  const [memberMessage, setMemberMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [memberId, setMemberId] = useState('');
  const [managerId, setManagerId] = useState('');
  const [taskId, setTaskId] = useState('');
  const auth = getAuth();
  const params = useParams();
  const [AssignedMember, setAssignedMember] = useState('');
  const [projectManager, setProjectManager] = useState('');

  useEffect(() => {
    async function fetchTask() {
      const taskRef = doc(db, 'TaskList', params.id);
      const docSnap = await getDoc(taskRef);
      if (docSnap.exists()) {
        const taskData = docSnap.data();
        setAssignedMember(taskData.member);
        setProjectManager(taskData.userRef);
        setMemberId(taskData.member);
        setManagerId(taskData.userRef);
        setTaskId(params.id);
      } else {
        console.log('Task not found');
      }
    }
    fetchTask();
  }, [params.id]);

  useEffect(() => {
    const messagesCollectionRef = collection(db, 'messages');
    const queryRef = query(
      messagesCollectionRef,
      where('taskId', '==', taskId)
    );

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [taskId]);

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
        memberId: memberId,
        managerId: managerId,
        taskId: taskId,
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
        memberId: memberId,
        managerId: managerId,
        taskId: taskId,
      };
      try {
        await addDoc(collection(db, 'messages'), message);
        setMemberMessage('');
      } catch (error) {
        console.error('Error adding message: ', error);
      }
    }
  };

  const handleDeleteMessages = async () => {
    try {
      await Promise.all(messages.map((msg) => deleteDoc(doc(db, 'messages', msg.id))));
      toast.success("Chat is deleted.")
    } catch (error) {
      console.error('Error deleting messages: ', error);
    }
  };

  return (
    <div className="bg-yellow-200 mx-auto flex justify-center items-center flex-col max-w-6xl p-4 rounded-lg shadow-lg mt-2">
      <h2 className="flex ml-2 text-2xl font-bold mb-2">
        Chatting Box
        <AiOutlineWechat className='ml-2 text-3xl text-blue-700'/>

        </h2>
      <div className="flex flex-col w-full max-w-lg">
        {projectManager === auth.currentUser.uid ? (
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
        ) : null}
        {AssignedMember === auth.currentUser.uid ? (
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
        ) : null}
        <div className="flex flex-col">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`bg-gray-100 p-2 rounded mb-2 ${
                msg.sender === 'manager' ? 'text-left' : 'text-right'
              }`}
            >
              <span className="font-bold">
                {msg.sender === 'manager' ? (
                  <FcBusinessman className='text-2xl' />
                ) : (
                  <FcManager className='flex ml-auto text-2xl' />
                )}
              </span>{' '}
              {msg.content}
            </div>
          ))}
        </div>
        {(auth.currentUser.uid === projectManager || auth.currentUser.uid === AssignedMember) && (
          <div className="flex justify-center">
            <button
              className="flex mb-2 items-center w-full md:w-[67%] lg:w-[40%] mt-6 bg-red-500 font-medium text-sm uppercase rounded shadow-md hover:bg-red-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-500 text-white px-10 py-3"
              onClick={handleDeleteMessages}
            >
              <FaTrashAlt className='text-2xl'/>
              Delete Messages
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
