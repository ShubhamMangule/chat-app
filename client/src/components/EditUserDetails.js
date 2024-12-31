import React, { useEffect, useState } from 'react';
import Avatar from './Avatar';
import uploadFile from '../helper/uploadFile';

const EditUserDetails = ({ userData, onClose }) => {
    const [data, setData] = useState({
        name: userData?.name,
        profile_pic: userData?.profile?._pic,
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    return (
        <div className='fixed top-0 bottom-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex items-center justify-center'>
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
                        <label htmlFor='profile_pic'>Photo</label>
                        <div className='my-1 flex items-center gap-4'>
                            <Avatar
                                width={40}
                                height={40}
                                imageUrl={data?.profile_pic}
                                name={data?.name}
                            />
                            <button className='font-semibold'>
                                Change Photo
                            </button>
                            <input
                                type='file'
                                className='hidden'
                                onChange={handelUploadPhoto}
                            />
                        </div>
                    </div>
                    <div className='flex gap-2 w-fit ml-auto mt-2'>
                        <button className='border-primary border text-primary rounded px-4 py-1'>
                            Cancel
                        </button>
                        <button className='border-primary border text-primary rounded px-4 py-1'>
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default React.memo(EditUserDetails);
