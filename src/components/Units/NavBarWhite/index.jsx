import React from 'react';
import { Link } from 'react-router-dom';
import './scoped.css'; // This is where you will import your CSS from
import { HomeOutlined } from '@ant-design/icons';

function NavBarWhite({ showLogo = true }) {
    return (
        <nav className="navigation-bar">
            <div className="logo">
                {showLogo && (
                    <Link to="/">
                        <HomeOutlined style={{ fontSize: '24px', color: '#3D739C' }} />
                    </Link>
                )}
            </div>
            <div className="nav-links">
                <Link to="/about">About</Link>
                {/* <Link to="/llm-agent" className="beta-link">
                    LLM Agent
                    <span className="beta-tag">Beta</span>
                </Link> */}
                <a href="https://glkb.dcmb.med.umich.edu/api/docs" target="_blank" >API Doc</a>
                <a href="https://jieliu6.github.io/" target="_blank">Contact Us</a>
            </div>
        </nav>
    );
}

export default NavBarWhite;
