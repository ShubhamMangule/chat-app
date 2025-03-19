import React, { useEffect, useRef, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helper/uploadFile';
import Divider from './Divider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/userSlice';

const EditUserDetails = ({ userData, onClose }) => {
    const [data, setData] = useState({
        name: userData?.name,
        profile_pic: userData?.profile?._pic,
    });

    const uploadPhotoRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        setData((pd) => {
            return {
                ...pd,
                ...userData,
            };
        });
    }, [userData]);

    const handelOnChange = (e) => {
        const { name, value } = e.target;
        setData((pd) => {
            return { ...pd, [name]: value };
        });
    };

    const handelUploadPhoto = async (e) => {
        const file = e.target.files[0];
        const uploadPhoto = await uploadFile(file);
        // setUploadPhoto(file);
        setData((pd) => {
            return { ...pd, profile_pic: uploadPhoto?.url };
        });
    };

    const handleOpenUploadPhoto = (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadPhotoRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/update-user`;
            const response = await axios.post(URL, data, {
                withCredentials: true,
            });
            toast.success(response?.data?.message);

            if (response?.data?.success) {
                dispatch(setUser(response?.data?.data));
                onClose();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex items-center justify-center z-10'>
            <div className='bg-white p-4 py-5 m-1 rounded max-w-sm'>
                <h2 className='font-bold'> Profile Details</h2>
                <p className='text-sm'>Edit user details</p>

                <form
                    action=''
                    className='grid  gap-3 mt-3'
                    onSubmit={handleSubmit}
                >
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            name='name'
                            id='name'
                            value={data?.name}
                            onChange={handelOnChange}
                            className='w-full py-1 px-2 focus:outline-primary border border-0.5'
                        />
                    </div>
                    <div>
                        Photo:
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <label htmlFor='profile_pic'>
                                <button
                                    className='font-semibold'
                                    onClick={handleOpenUploadPhoto}
                                >
                                    Change Photo
                                </button>
                                <input
                                    type='file'
                                    className='hidden'
                                    id='profile_pic'
                                    onChange={handelUploadPhoto}
                                    ref={uploadPhotoRef}
                                />
                            </label>
                        </div>
                    </div>
                    <Divider />
                    <div className='flex gap-2 w-fit ml-auto'>
                        <button
                            onClick={onClose}
                            className='border-primary border text-primary rounded px-4 py-1 hover:bg-primary hover:text-white'
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='border-primary border bg-primary text-white rounded px-4 py-1 hover:bg-secondary'
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(EditUserDetails);
