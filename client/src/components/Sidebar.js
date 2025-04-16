/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { FaUserPlus, FaVideo } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { CiLogout } from 'react-icons/ci';
import { NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import EditUserDetails from './EditUserDetails';
import { FiArrowUpLeft } from 'react-icons/fi';
import { SearchUser } from './SearchUser';
import { FaPlus } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { logout } from '../redux/userSlice';
// import { EditUserDetails } from './EditUserDetails';

function Sidebar() {
    const user = useSelector((state) => state?.user);
    const [editUserOpen, setEditUserOpen] = useState(false);
    const [allUser, setAllUser] = useState([]);
    const [openSearchUser, setOpenSearchUser] = useState(false);
    const socketConnection = useSelector(
        (state) => state?.user?.socketConnection,
    );

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // console.log('user?._id', user?._id);
    useEffect(() => {
        if (socketConnection) {
            if (user?._id) socketConnection.emit('sidebar', user?._id);

            socketConnection.on('conversation', (data) => {
                // console.log('data', data);

                const conversationUserData = data?.map((convUser, index) => {
                    if (convUser?.sender?._id === convUser?.receiver?._id) {
                        return {
                            ...convUser,
                            userDetails: convUser?.sender,
                        };
                    } else if (convUser?.receiver?._id !== user?._d) {
                        return {
                            ...convUser,
                            userDetails: convUser?.receiver,
                        };
                    } else {
                        return {
                            ...convUser,
                            userDetails: convUser?.sender,
                        };
                    }
                });
                setAllUser(conversationUserData);
            });
        }
    }, [socketConnection, user]);

    const handleLogout = () => {
        dispatch(logout);
        navigate('/email');
    };

    return (
        <div className='w-full h-full grid grid-cols-[48px,1fr] bg-white'>
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
                        title='Add Friend'
                        className='w-12 h-12 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md'
                        onClick={() => setOpenSearchUser(true)}
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
                        <Avatar
                            width={36}
                            height={36}
                            name={user?.name}
                            imageUrl={user?.profile_pic}
                            userId={user?._id}
                        />
                    </button>
                    <button
                        className='w-12 h-12 flex items-center justify-center hover:bg-gray-300 cursor-pointer rounded-md'
                        title='Logout'
                        onClick={handleLogout}
                    >
                        <span className='-ml-2'>
                            <CiLogout size={25} />
                        </span>
                    </button>
                </div>
            </div>

            <div className='w-full'>
                <div className='h-16 flex items-center'>
                    <h2 className='text-xl font-bold p-3 text-stone-700'>
                        Message
                    </h2>
                </div>
                <div className='bg-slate-200 p-[0.5px]'></div>
                <div className='h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar'>
                    {allUser.length === 0 && (
                        <div className='mt-12'>
                            <div className='flex justify-center items-center my-4 text-slate-500'>
                                <FiArrowUpLeft size={50} />
                            </div>
                            <p className='text-lg text-center text-slate-400'>
                                Explore users to start a conversation with
                            </p>
                        </div>
                    )}

                    {allUser?.map((conv, ind) => {
                        return (
                            <NavLink
                                to={'/' + conv?.userDetails?._id}
                                key={conv?._id}
                                className='flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer '
                            >
                                <div>
                                    <Avatar
                                        width={40}
                                        height={40}
                                        name={conv?.userDetails?.name}
                                        imageUrl={
                                            conv?.userDetails?.profile_pic
                                        }
                                        userId={user?._id}
                                    />
                                </div>
                                <div>
                                    <h3 className='text-ellipsis line-clamp-1 font-semibold text-base'>
                                        {conv?.userDetails?.name}
                                    </h3>
                                    <div className='text-slate-500 text-xm'>
                                        <div className='flex items-center gap-1'>
                                            {conv?.lastMsg?.imageUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span>
                                                        <FaImage />
                                                    </span>
                                                    {!conv?.lastMsg?.text && (
                                                        <span>Image</span>
                                                    )}
                                                </div>
                                            )}
                                            {conv?.lastMsg?.videoUrl && (
                                                <div className='flex items-center gap-1'>
                                                    <span>
                                                        <FaVideo />
                                                    </span>
                                                    {!conv?.lastMsg?.text && (
                                                        <span>Video</span>
                                                    )}
                                                </div>
                                            )}
                                            <p className='text-ellipsis line-clamp-1'>
                                                {conv?.lastMsg?.text}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {Boolean(conv?.unSeenMsg) && (
                                    <p className='text-sm w-6 h-6 flex  justify-center items-center  ml-auto p-1 bg-primary text-white font-semibold rounded-full '>
                                        {conv?.unSeenMsg}
                                    </p>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* edit user details} */}
            {editUserOpen && (
                <EditUserDetails
                    userData={user}
                    onClose={() => setEditUserOpen(false)}
                />
            )}

            {/* search user */}
            {openSearchUser && (
                <SearchUser onClose={() => setOpenSearchUser(false)} />
            )}
        </div>
    );
}

export default Sidebar;
