import React from 'react';
import { FaUser } from 'react-icons/fa';
import { useSelector } from 'react-redux';

function Avatar({ userId, name, imageUrl, width, height }) {
    const onlineUser = useSelector((state) => state?.user?.onlineUser);

    let avatarName = '';
    if (name) {
        const splitName = name?.split(' ');
        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0];
        } else {
            avatarName = splitName[0][0];
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-teal-200',
        'bg-red-200',
        'bg-green-200',
        'bg-yellow-200',
        'bg-orange-200',
        'bg-cyan-200',
        'bg-orange-200',
        'bg-amber-500',
        'bg-lime-500',
    ];

    const randomNumber = Math.floor(Math.random() * 10);

    const isOnline = onlineUser.includes(userId);

    return (
        <div
            className={`text-slate-800 rounded-full border font-bold relative ${bgColor[randomNumber]}`}
            style={{ width: width + 'px', height: height + 'px' }}
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    width={width}
                    height={height}
                    alt={name}
                    className='overflow-hidden rounded-full'
                />
            ) : name ? (
                <div
                    style={{ width: width + 'px', height: height + 'px' }}
                    className={`overflow-hidden rounded-full flex justify-center items-center text-lg ${bgColor[randomNumber]}`}
                >
                    {avatarName}
                </div>
            ) : (
                <FaUser size={width} />
            )}
            {isOnline && (
                <div className='bg-green-500 p-1 absolute bottom-2 right-0 z-10 rounded-full'></div>
            )}
        </div>
    );
}

export default Avatar;
