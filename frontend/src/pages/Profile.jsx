import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link } from 'react-router';

const Profile = () => {
  const { authUser } = useAuthUser();
  console.log(authUser);
  return (
    <div className='flex flex-col items-center  h-full space-y-3 p-10'>
      <div className='avatar w-32 h-32 rounded-full overflow-hidden'>
        <img src={authUser?.profilePic} alt="Profile" className='object-cover' />
      </div>
      <div className='text-center'>
        <h2 className='text-lg font-semibold'>{authUser?.fullName}</h2>
        <p className='text-sm text-gray-500'>{authUser?.email}</p>
        <div>
          <p className='text-sm text-gray-500'>{authUser?.bio || "No bio available"}</p>
        </div>
        <div className='mt-4 flex flex-col space-y-2 items-center justify-start'>
          <Link to="/edit-profile" className=" text-secondary hover:underline">Edit Profile</Link>
          <Link to="/forgot-password" className="text-secondary hover:underline">Forgot Password</Link>
          <p className="text-red-600 cursor-pointer hover:underline">Logout</p>
        </div>
      </div>
    </div>
  )
}

export default Profile