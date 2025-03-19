import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const MessagePage = () => {
    const params = useParams();
    const socketConnection = useSelector(
        (state) => state?.user?.socketConnection,
    );
    const [dataUser, setDataUser] = useState({
        name: '',
        email: '',
        profile_pic: '',
        online: false,
    });
    // console.log('params', params?.userId);

    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit('message-page', params?.userId);

            socketConnection.on('message-user', (data) => {
                // console.log('data', data);
                setDataUser(data);
            });
        }
    }, [socketConnection]);

    return <div>MessagePage</div>;
};

export default MessagePage;
