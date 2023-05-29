import React from 'react';
import {Link} from "react-router-dom";
import Moment from "react-moment";

export default function ListingTask({ taskList, id }) {
 
    return <li className='text-black relative bg-yellow-200 flex flex-col justify-between  shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className='contents' to={`/category/${id}`}>
            <img className=' mt-2 h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out' loading='lazy' src={taskList.imgUrls[0]} />
            <Moment className='absolute top-2 left-2 bg-[#10cc74] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg' fromNow>
                {taskList.timestamp?.toDate()}
            </Moment>
                <div className='ml-6 font-semibold justify-between text-sm items-center space-x-1'>
                    <p className=' mt-2 truncate text-2xl text-blue-500'>Name: {taskList.name}</p>
                     <p>Status: {taskList.status}</p>
                     <p>Priority:
                     <span className={`ml-1 ${taskList.priority === 'low' ? 'text-green-500' : taskList.priority === 'normal' ? 'text-blue-500' : 'text-red-500'}`}>{taskList.priority}</span> 
                    </p>
                    <p>Due Date:  {taskList.dueDate}</p>
                </div>
        </Link>

        </li>;
}
