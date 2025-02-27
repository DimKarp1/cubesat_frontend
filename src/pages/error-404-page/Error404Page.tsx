import React from 'react';
import './error-404-page.css'
import Img404 from '../../assets/404.jpg'
const Error404Page: React.FC = () => {
    return (
        <div className={'container-error'}>
            <img src={Img404} alt={'404 img'} className={'w-100'}/>
        </div>
    );
};

export default Error404Page;