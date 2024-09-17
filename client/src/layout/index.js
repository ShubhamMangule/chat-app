import React from 'react';
import logo from '../assets/logo.png';
import shridhaLogo from '../assets/shridha_logo.png';

const AuthLayouts = ({ children }) => {
    return (
        <>
            <header className='flex justify-between items-center py-3 h-20 shadow-md bg-white'>
                <div className='absolute left-0 ml-4 cursor-pointer'>
                    <img
                        src={shridhaLogo}
                        alt='Shridha Logo'
                        width={70}
                        height={30}
                    />
                </div>

                <div className='flex-grow flex justify-center'>
                    <img src={logo} alt='logo' width={180} height={50} />
                </div>
            </header>
            {children}
        </>
    );
};

export default AuthLayouts;
