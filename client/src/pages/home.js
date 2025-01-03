import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout, setUser } from '../redux/userSlice';
import Sidebar from '../components/Sidebar';

const Home = () => {
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    console.log('user', user);

    const fetchUserDetails = async () => {
        try {
            const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`;
            const response = await axios({ url: URL, withCredentials: true });

            dispatch(setUser(response?.data?.data));

            if (response?.data?.logout) {
                dispatch(logout());
                navigate('/email');
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        fetchUserDetails();
    }, []);

    const basePath = location.pathname === '/';

    return (
        <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
            <section className='bg-red-800'>
                <Sidebar />
            </section>
            <section className={``}>
                <Outlet />
            </section>
        </div>
    );
};

export default Home;
