import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import { TweenOneGroup } from "rc-tween-one";
import {Input, Col, Row, Spin, Tag, Menu, Layout} from 'antd';
import './scoped.css'
import GLKBLogoImg from '../../img/glkb_logo.png'
import UMLogo from '../../img/um_logo.jpg'
import MedSchoolLogo from '../../img/MedSchoolLogo.png'
import { DingtalkCircleFilled } from '@ant-design/icons';
import NavBar from '../NavBar';
import SearchBar from '../SearchBar'
import GLKBLogo_L from '../../img/logo_l.svg'
import GLKBLogoSVG from '../../img/logo.svg'


const { Header, Content, Footer } = Layout;
const { Search } = Input;

const HomePage = () => {
    let nevigate = useNavigate();
    const handleSearch = async (v) => {
        nevigate(`/result?q=${v}`)
    }

    const [tags, setTags] = useState([]);

    return (
        <div>
            <Layout className="layout">
                <nav className="navbar">
                    <a href="/" className="home-link">
                        <img src={GLKBLogo_L} alt="Home" />
                        <a>Genomic Literature Knowledge Base</a>
                        {/*<a href="/about">Home</a>*/}
                    </a>
                    <div className="nav-links">
                        <a href="/about">About</a>
                        <a href="https://glkb.dcmb.med.umich.edu/docs" target="_blank">API Doc</a>
                        <a href="/contact-us">Contact Us</a>
                    </div>
                </nav>

                <Content style={{ padding: '0 50px' }}>
                    <div className="site-layout-content">
                        <img src={GLKBLogoSVG} alt="Home" height="140"/>
                        {/*<Search*/}
                        {/*    placeholder="Enter terms to begin your search"*/}
                        {/*    enterButton*/}
                        {/*    size="large"*/}
                        {/*    onSearch={value => console.log(value)}*/}
                        {/*/>*/}
                        <SearchBar
                            handleSearchTags = {handleSearch}
                            tags = {tags}
                            setTags = {setTags}
                        />
                        <p>Need Help? <a href="https://google.com" target="_blank"> Tutorials.</a></p>
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    <img src={UMLogo} alt="Home" height="80"/>
                    <p>© 2022 Liu Lab, Department of Computational Medicine and Bioinformatics</p>
                </Footer>
            </Layout>


        </div>
    )
}


export default HomePage