import React from 'react';
import Img403 from '../../assets/403.png'
import './error-403-page.css'
const Error403Page: React.FC = () => {
    return (
        <div className={'container-error'}>
            <img src={Img403} alt={'403 Img'} className={'w-100'}/>
        </div>
    );
};


export default Error403Page;