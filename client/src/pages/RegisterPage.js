import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        profile_pic: '',
    });

    const [uploadPhoto, setUploadPhoto] = useState('');

    const handelChange = (e) => {
        const { name, value } = e.target;
        setData((pd) => {
            return {
                ...pd,
                [name]: value,
            };
        });
    };

    const handelUploadPhoto = (e) => {
        const file = e.target.files[0];
        setUploadPhoto(file);
    };

    const handleClearUploadPhoto = (e) => {
        e.stopPropagation();
        e.preventDefault();
        setUploadPhoto(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(data);
    };

    return (
        <div children='mt-10'>
            <div className='bg-white w-full max-w-sm rounded overflow-hidden px-4 mt-5 p-4 mx-auto'>
                <h3 className='text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-red-400'>
                    Welcome to Chat App!
                </h3>
                <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-1'>
                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            placeholder='Enter Your name'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data?.name}
                            onChange={handelChange}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor='email'>Email:</label>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            placeholder='Enter Your email'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data?.email}
                            onChange={handelChange}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor='password'>Password:</label>
                        <input
                            type='password'
                            id='password'
                            name='password'
                            placeholder='Enter Your password'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary'
                            value={data?.password}
                            onChange={handelChange}
                            required
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label htmlFor='profile_pic'>
                            Photo:
                            <div className='h-14 bg-slate-100 flex justify-center items-center border rounded hover:border-primary cursor-pointer'>
                                <p className='text-sm max-w-[300px] text-ellipsis line-clamp-1 '>
                                    {uploadPhoto?.name
                                        ? uploadPhoto?.name
                                        : 'Upload profile Pic'}
                                </p>
                                {uploadPhoto?.name && (
                                    <button
                                        className='text-lg ml-2 hover:text-red-600 font-extrabold'
                                        onClick={handleClearUploadPhoto}
                                    >
                                        <IoCloseOutline />
                                    </button>
                                )}
                            </div>
                        </label>
                        <input
                            type='file'
                            id='profile_pic'
                            name='profile_pic'
                            placeholder='Enter Your profile pic'
                            className='bg-slate-100 px-2 py-1 focus:outline-primary hidden'
                            value={data?.profile_pic}
                            onChange={handelUploadPhoto}
                        />
                    </div>

                    <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed'>
                        Register
                    </button>
                </form>
                <p className='my-3 text-center'>
                    Already Have Account ?
                    <Link
                        to={'/email'}
                        className='hover:text-primary hover:underline hover:font-semibold'
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
