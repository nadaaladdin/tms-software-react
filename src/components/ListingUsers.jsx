import React from 'react'

export default function ListingUsers({user, id}) {
  
    return (
    
    <li>
            <div className='ml-6 font-semibold justify-between text-sm items-center space-x-1'>
                <p className=' mt-2 truncate text-2xl text-blue-500'>{user.name}</p>
            </div>
            
    </li>
)}
