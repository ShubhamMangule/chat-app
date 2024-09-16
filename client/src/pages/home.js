import React from 'react';
import { Outlet } from 'react-router-dom';

const home = () => {
    return (
        <div>
            Home
            <section>
                <Outlet />
            </section>
        </div>
    );
};

export default home;
