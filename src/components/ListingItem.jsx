import React from 'react';
import {Link} from "react-router-dom";
import Moment from "react-moment";
export default function ListingItem({ projectList, id }) {

    return <li className='text-blue-900 relative bg-blue-200 flex flex-col justify-between  shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-[10px]'>
        <Link className='contents' to={`/category/${projectList.type}/${id}`}>
            <img className=' mt-2 h-[170px] w-full object-cover hover:scale-105 transition-scale duration-200 ease-in-out' loading='lazy' src={projectList.imgUrls[0]} />
            <Moment className='absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg' fromNow>
                {projectList.timestamp?.toDate()}
            </Moment>
                <div className='ml-6 font-semibold justify-between text-sm items-center space-x-1'>
                    <p className=' mt-2 truncate text-2xl text-green-700'>Name: {projectList.name}</p>
                     <p>Manager: {projectList.projectManager}</p>
                    <p>Status: {projectList.status}</p> 
                </div>

                <div className='flex  items-center ml-7 space-x-3  mt-[10px]space-x-1'>
                <p className="font-bold text-xs">
                {projectList.numOfTasks > 1 ? `${projectList.numOfTasks} Tasks` : "1 Task"}
              </p>      
              <p className="font-bold text-xs">
                {projectList.numOfMembers > 1 ? `${projectList.numOfMembers} Members` : "1 Member"}
              </p>  
                </div>

            
        </Link>
        </li>;
  }