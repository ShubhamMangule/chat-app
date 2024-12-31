import React, { useState } from 'react';
import { FaUserPlus } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';
import { useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
// import { EditUserDetails } from './EditUserDetails';

function Sidebar() {
    const user = useSelector((state) => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(true);

    return (
        <div className='w-full h-full'>
            <div className='bg-white w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between'>
                <div>
                    <NavLink
                        className={({ isActive }) =>
                            `w-12 h-12 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md ${
                                isActive && 'bg-slate-200'
                            }`
                        }
                        title='chat'
                    >
                        <IoChatbubbleEllipsesOutline size={25} />
                    </NavLink>
                    <div
                        className='w-12 h-12 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md'
                        title='Add Friend'
                    >
                        <FaUserPlus size={25} />
                    </div>
                </div>
                <div className='flex flex-col items-center'>
                    <button
                        className='mx-auto'
                        title={user?.name}
                        onClick={() => setEditUserOpen(true)}
                    >
                        <Avatar width={36} height={36} name={user?.name} />
                    </button>
                    <button
                        className='w-12 h-12 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md'
                        title='Logout'
                    >
                        <span className='-ml-2'>
                            <CiLogout size={25} />
                        </span>
                    </button>
                </div>
            </div>

            {editUserOpen && (
                <EditUserDetails
                    userData={user}
                    onClose={() => setEditUserOpen(false)}
                />
            )}
        </div>
    );
}

export default Sidebar;
