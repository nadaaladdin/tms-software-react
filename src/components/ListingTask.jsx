import React from 'react';
import {Link} from "react-router-dom";
import Moment from "react-moment";

export default function ListingTask({ taskList, id }) {
 
    return <li className='text-blue-900 relative bg-blue-200 flex flex-col justify-between  shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className='contents' to={`/category/${id}`}>
            <img className=' mt-2 h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out' loading='lazy' src={taskList.imgUrls[0]} />
            <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg' fromNow>
                {taskList.timestamp?.toDate()}
            </Moment>
                <div className='ml-6 font-semibold justify-between text-sm items-center space-x-1'>
                    <p className=' mt-2 truncate text-2xl text-green-700'>Name: {taskList.name}</p>
                     <p>Priority: {taskList.priority}</p>
                    <p>Status: {taskList.status}</p> 
                    <p>Due Date:  {taskList.dueDate}</p>
                </div>
        </Link>

        </li>;
}
