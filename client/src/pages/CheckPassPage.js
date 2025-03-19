import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken } from '../redux/userSlice';

const CheckPassPage = () => {
    const [data, setData] = useState({
        password: '',
    });

    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!location?.state?.name) {
            navigate('/email');
        }
    }, []);

    const handelChange = (e) => {
        const { name, value } = e.target;
        setData((pd) => {
            return {
                ...pd,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`;

        try {
            const response = await axios({
                method: 'POST',
                url: URL,
                data: {
                    userId: location?.state?._id,
                    password: data?.password,
                },
                withCredentials: true,
            });

            toast.success(response?.data?.message);

            if (response.data?.success) {
                dispatch(setToken(response?.data?.token));
                localStorage.setItem('token', response?.data?.token);

                setData({
                    password: '',
                });
                navigate('/');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div children='mt-10'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden px-4 mt-5 p-4  mx-2 md:mx-auto'>
                <div className='w-fit mx-auto mb-2 flex justify-center items-center flex-col'>
                    <Avatar
                        width={70}
                        height={70}
                        name={location?.state?.name}
                        imageUrl={location?.state?.profile_pic}
                    />
                    <h2 className='font-semibold text-lg mt-2'>
                        {location?.state?.name}
                    </h2>
                </div>

                <h3 className='text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-red-400'>
                    Welcome to Chat App!
                </h3>

                <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
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

                    <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed'>
                        Login
                    </button>
                </form>
                <p className='my-3 text-center'>
                    <Link
                        to={'/forgot-password'}
                        className='hover:text-primary hover:underline hover:font-semibold ml-1'
                    >
                        Forgot Password ?
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CheckPassPage;
