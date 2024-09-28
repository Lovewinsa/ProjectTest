import React from 'react';
import '../css/Footer.css'

function Footer(props) {
    return (
        <footer className='Footer'>
            <div>
                <img className="logo" alt="IconImage" src="/img/img02.png" />
                    <p>ROUTE SHARE</p>
                    <p>회사정보 회사정보</p>
                    <p>Copyright © 루트쉐어 All rights reserved</p>
            </div>
        </footer>
    );
}

export default Footer;