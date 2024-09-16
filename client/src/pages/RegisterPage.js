import React, { useState } from 'react';

const RegisterPage = () => {
    const [data, setData] = useState({
        name: '',
        email: '',
        password: '',
        proflie_pic: '',
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

    return (
        <div children='mt-10'>
            <div className='bg-white w-full max-w-sm mx-2 rounded overflow-hidden px-4 mt-5'>
                <h3>Welcome to Chat App!</h3>
                <form className='grid gap-3 mt-5'>
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
                                <p className='text-sm'>
                                    {uploadPhoto.name
                                        ? uploadPhoto?.name
                                        : 'Upload profile Pic'}
                                </p>
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
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
