import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { HiDotsVertical } from 'react-icons/hi';
import { FaAngleLeft } from 'react-icons/fa6';
import { FaPlus } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import { FaVideo } from 'react-icons/fa6';
import uploadFile from '../helper/uploadFile';
import { IoMdClose } from 'react-icons/io';

const MessagePage = () => {
    const params = useParams();
    const socketConnection = useSelector(
        (state) => state?.user?.socketConnection,
    );
    const user = useSelector((state) => state?.user);
    const [dataUser, setDataUser] = useState({
        _id: '',
        name: '',
        email: '',
        profile_pic: '',
        online: false,
    });
    const [openImgVideoUpload, setOpenImgVideoUpload] = useState(false);
    const [message, setMessage] = useState({
        text: '',
        imageUrl: '',
        videoUrl: '',
    });

    const handleUploadImgVideoOpen = () => {
        setOpenImgVideoUpload((pd) => !pd);
    };
    // console.log('params', params?.userId);

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('message-page', params?.userId);

            socketConnection.on('message-user', (data) => {
                // console.log('data', data);
                setDataUser(data);
            });
        }
    }, [socketConnection, params?.userId, user]);

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        const upload = await uploadFile(file);
        setMessage((pd) => {
            return { ...pd, imageUrl: upload?.url };
        });
    };

    const handleClearUploadImage = () => {
        setMessage((pd) => {
            return { ...pd, imageUrl: '' };
        });
    };

    const handleUploadVideo = async (e) => {
        const file = e.target.files[0];
        const upload = await uploadFile(file);
        setMessage((pd) => {
            return { ...pd, videoUrl: upload?.url };
        });
    };

    const handleClearUploadVideo = () => {
        setMessage((pd) => {
            return { ...pd, videoUrl: '' };
        });
    };
    return (
        <div>
            <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
                <div className='flex items-center gap-4'>
                    <Link to={'/'} className='lg:hidden'>
                        <FaAngleLeft size={25} />
                    </Link>
                    <div>
                        <Avatar
                            width={50}
                            height={50}
                            imageUrl={dataUser?.profile_pic}
                            name={dataUser?.name}
                            userId={dataUser?._id}
                        />
                    </div>
                    <div>
                        <h3 className='font-semibold text-lg my-0 text-ellipsis line-clamp-1'>
                            {dataUser?.name}
                        </h3>
                        <p className='-mt-2'>
                            {dataUser.online ? (
                                <span className='text-primary'>online</span>
                            ) : (
                                <span className='text-slate-400'>offline</span>
                            )}
                        </p>
                    </div>
                </div>

                <div>
                    <button className='cursor-pointer hover:text-primary'>
                        <HiDotsVertical />
                    </button>
                </div>
            </header>

            {/* show all msg */}
            <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative'>
                {/* Image */}
                {message?.imageUrl && (
                    <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div
                            className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'
                            onClick={handleClearUploadImage}
                        >
                            <IoMdClose size={30} />
                        </div>
                        <div className='bg-white p-3'>
                            <img
                                src={message?.imageUrl}
                                alt='uploadImage'
                                className='aspect-video w-full h-full max-w-sm m-2'
                            />
                        </div>
                    </div>
                )}
                {/* video */}
                {message?.videoUrl && (
                    <div className='w-full h-full bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden'>
                        <div
                            className='w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600'
                            onClick={handleClearUploadVideo}
                        >
                            <IoMdClose size={30} />
                        </div>
                        <div className='bg-white p-3'>
                            <video
                                src={message?.videoUrl}
                                className='aspect-video w-full h-full max-w-sm m-2'
                                controls
                                muted
                                autoPlay
                            />
                        </div>
                    </div>
                )}
            </section>

            {/* send msg */}
            <section className='h-16 bg-white flex items-start px-4'>
                <div className='relative'>
                    <button
                        onClick={handleUploadImgVideoOpen}
                        className='flex justify-center items-center w-11 h-11 rounded-full hover:bg-primary hover:text-white'
                    >
                        <FaPlus size={20} />
                    </button>

                    {/* video and img */}
                    {openImgVideoUpload && (
                        <div className='bg-white shadow rounded absolute bottom-11 w-36 p-2'>
                            <form action=''>
                                <label
                                    htmlFor='uploadImage'
                                    className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-200'
                                >
                                    <div className='text-primary'>
                                        <FaImage size={18} />
                                    </div>
                                    <p>Image</p>
                                </label>
                                <label
                                    htmlFor='uploadVideo'
                                    className='flex items-center p-2 gap-3 px-3 cursor-pointer hover:bg-slate-200'
                                >
                                    <div className='text-purple-600'>
                                        <FaVideo size={18} />
                                    </div>
                                    <p>Video</p>
                                </label>
                                <input
                                    type='file'
                                    id='uploadImage'
                                    onChange={handleUploadImage}
                                />
                                <input
                                    type='file'
                                    id='uploadVideo'
                                    onChange={handleUploadVideo}
                                />
                            </form>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default MessagePage;
