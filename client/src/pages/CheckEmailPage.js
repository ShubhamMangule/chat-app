import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const CheckEmailPage = () => {
    const [data, setData] = useState({
        email: '',
    });

    const navigate = useNavigate();

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

        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/email`;

        try {
            const response = await axios.post(URL, data);

            toast.success(response.data?.message);
            if (response.data?.success) {
                setData({
                    email: '',
                });
                navigate('/password', {
                    state: response?.data?.data,
                });
            }
        } catch (error) {
            toast.error(error.response.data?.message);
        }
    };

    return (
        <div children='mt-10'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden px-4 mt-5 p-4  mx-2 md:mx-auto'>
                <div className='w-fit mx-auto mb-2'>
                    <FaUser size={30} />
                </div>

                <h3 className='text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-red-400'>
                    Welcome to Chat App!
                </h3>

                <form className='grid gap-3 mt-5' onSubmit={handleSubmit}>
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

                    <button className='bg-primary text-lg px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed'>
                        Let's Go
                    </button>
                </form>
                <p className='my-3 text-center'>
                    New User ?
                    <Link
                        to={'/register'}
                        className='hover:text-primary hover:underline hover:font-semibold ml-1'
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CheckEmailPage;
