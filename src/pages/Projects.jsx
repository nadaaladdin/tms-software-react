import React from 'react'
import { Link } from 'react-router-dom';
import {FcTodoList, FcAddImage} from 'react-icons/fc';

import { icons } from 'react-icons/lib';

export default function Projects() {
  return (
    <section>
      <h1 className='text-3xl text-center mt-6 font-bold text-blue-900'>
        Projects
      </h1>

      <div className='flex justify-center flex-wrap items-center px-6 py-12 max-w-6xl mx-auto'>
        <div className='md:w-[67%] lg:w-[50%] mb-12 md:mb-6'>
          <img  src='https://www.meistertask.com/blog/wp-content/uploads/2021/02/MT_fortaskmanagement_header-796x398.png' 
                alt='task' 
                className='w-full rounded-xl'/>
        </div>

        
      <div className='w-full md:w-[67%] lg:w-[40%] lg:ml-20'>

        <div className=' mb-5'>
          <button className="w-full bg-yellow-500 font-medium text-sm uppercase rounded shadow-md hover:bg-yellow-300 transition duration-150 ease-in-out hover:shadow-lg active:bg-yellow-500 text-white px-7 py-3"
                type="submit">
                <Link to="/create-project" className='flex justify-center items-center '>
                <FcAddImage className='mr-2 text-3xl ' />
                   Create New project
                  </Link>
          </button>
        </div>

        <div className='mb-5'>

          <button className="w-full bg-red-500 font-medium text-sm uppercase rounded shadow-md hover:bg-red-400 transition duration-150 ease-in-out hover:shadow-lg active:bg-red-500 text-white px-7 py-3"
                type="submit">
            <Link to="/listing-project" className='flex justify-center items-center'>
            <FcTodoList className='mr-2 text-3xl'/>
            View My projects
            </Link>
          </button>
        </div>

      </div>

    </div>
    </section>
  )
}