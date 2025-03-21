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
import { Loading } from './Loading';
import bgImg from '../assets/wallapaper.jpeg';
import { IoSend } from 'react-icons/io5';
import moment from 'moment';

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
    const [loading, setLoading] = useState(false);
    const [allMessage, setAllMessage] = useState([]);
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
                setDataUser(data);
            });
            socketConnection.on('message', (data) => {
                setAllMessage(data);
                // console.log('data', data);
            });
        }
    }, [socketConnection, params?.userId, user]);

    const handleUploadImage = async (e) => {
        const file = e.target.files[0];
        setLoading(true);
        const upload = await uploadFile(file);
        setLoading(false);
        setOpenImgVideoUpload(false);
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
        setLoading(true);
        const upload = await uploadFile(file);
        setLoading(false);
        setOpenImgVideoUpload(false);
        setMessage((pd) => {
            return { ...pd, videoUrl: upload?.url };
        });
    };

    const handleClearUploadVideo = () => {
        setMessage((pd) => {
            return { ...pd, videoUrl: '' };
        });
    };

    const handleOnchage = (e) => {
        const { name, value } = e.target;
        setMessage((pd) => {
            return {
                ...pd,
                text: value,
            };
        });
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (message?.text || message?.imageUrl || message?.videoUrl) {
            if (socketConnection) {
                socketConnection?.emit('new message', {
                    sender: user?._id,
                    receiver: params?.userId,
                    text: message?.text,
                    imageUrl: message?.imageUrl,
                    videoUrl: message?.videoUrl,
                    msgByUserId: user?._id,
                });
                setMessage({
                    text: '',
                    imageUrl: '',
                    videoUrl: '',
                });
            }
        }
    };

    return (
        <div
            style={{ backgroundImage: `url(${bgImg})` }}
            className='bg-no-repeat bg-cover'
        >
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
            <section className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-55'>
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
                                className='aspect-square w-full h-full max-w-sm m-2'
                                controls
                                muted
                                autoPlay
                            />
                        </div>
                    </div>
                )}
                {loading && (
                    <div className='flex w-full h-full justify-center items-center'>
                        <Loading />
                    </div>
                )}

                {/* show all msg here */}
                <div className='flex flex-col gap-2 '>
                    {allMessage?.map((msg, index) => (
                        <div
                            key={index}
                            className='bg-white p-1 py-1 rounded w-fit'
                        >
                            <p className='px-2'>{msg?.text}</p>
                            <p
                                className={`text-xs ml-auto w-fit ${
                                    user?._id === msg?.msgByUserId
                                        ? 'ml-auto'
                                        : ''
                                }`}
                            >
                                {moment(msg?.createdAt).format('hh:mm')}
                            </p>
                        </div>
                    ))}
                </div>
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
                                    className='hidden'
                                />
                                <input
                                    type='file'
                                    id='uploadVideo'
                                    onChange={handleUploadVideo}
                                    className='hidden'
                                />
                            </form>
                        </div>
                    )}
                </div>

                {/* input box */}
                <form
                    className='h-full w-full flex'
                    onSubmit={handleSendMessage}
                >
                    <input
                        type='text'
                        className='py-1 px-4 outline-none w-full h-full'
                        placeholder='Type here msg...'
                        value={message?.text}
                        onChange={handleOnchage}
                    />
                    <button className='text-primary hover:text-secondary'>
                        <IoSend size={28} />
                    </button>
                </form>
            </section>
        </div>
    );
};

export default MessagePage;
