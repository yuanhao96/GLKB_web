import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import 'antd/dist/reset.css';
import { TweenOneGroup } from "rc-tween-one";
import {Input, Tag} from 'antd';
import './scoped.css'
import GLKBLogoImg from '../../img/glkb_home_logo.png'
import MedSchoolLogo from '../../img/MedSchoolLogo.png'
import { DingtalkCircleFilled } from '@ant-design/icons';

const { Search } = Input;

const HomePage = () => {
    let nevigate = useNavigate();
    const handleSearch = async (v) => {
        const alltags = tags.join("|")
        console.log(alltags)
        // console.log(v)
        nevigate(`/result?q=${alltags}`)
    }

    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        if (inputVisible) {
        inputRef.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        console.log(newTags);
        setTags(newTags);
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleInputConfirm = () => {
        if (inputValue && tags.indexOf(inputValue) === -1) {
        setTags([...tags, inputValue]);
        }
        setInputVisible(false);
        setInputValue("");
    };

    const forMap = (tag) => {
        const tagElem = (
        <Tag
            className='tag-box'
            closable
            onClose={(e) => {
            e.preventDefault();
            handleClose(tag);
            }}
        >
            {tag}
        </Tag>
        );
        return (
        <span key={tag} style={{ display: "inline-block" }}>
            {tagElem}
        </span>
        );
    };

    const tagChild = tags.map(forMap);

    return (
    <div className="home-container">
        <div className="home-head-container">
            <img src={GLKBLogoImg} style={{ height: 100 }} />
            <div className="head-text">
                A database and data mining platform for biomedical
                literature
            </div>
            <div className='search-container'>
                <div className='termContainer'>
                    <h2>Terms</h2>
                    <div style={{ marginBottom: 16 }}>
                    <TweenOneGroup
                        enter={{
                            scale: 0.8,
                            opacity: 0,
                            type: "from",
                            duration: 100
                        }}
                        onEnd={(e) => {
                            if (e.type === "appear" || e.type === "enter") {
                                e.target.style = "display: inline-block";
                            }
                        }}
                        leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                        appear={false}
                        >
                        {tagChild}
                        </TweenOneGroup>
                    </div>
                </div>
                <button onClick={handleSearch} className='map-button'>
                    Map Terms!
                </button>
                <Input
                        type="text"
                        size="large"
                        placeholder="Input terms here, hit enter to confirm the term"
                        className='search-bar'
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputConfirm}
                        onPressEnter={handleInputConfirm}
                    />
            </div>
        </div>
        {/* <div className="feature-container">
            <div className="feature-heading">
                    Features
            </div>
        </div>
        <div className="bar"></div>
        <div className="credits-container">
            <div className="credits-heading">
                    Credits:
            </div>
        </div> */}
        <div className="footer-container">
            <div className="UMichLogo-container">
                <img src={MedSchoolLogo} style={{ height: 100 }} />
            </div>
            <div className="Department-container">
                Department of
                Computational Medicine
                and Bioinformatics
            </div>
            <div className="contact-container">
                <div className="contact-heading">
                    Contacts:
                </div>
            </div>
            <div className="address-container">
                Palmer Commons 2035D, Ann Arbor, MI 48109
            </div>
            <div className="footnote-container">
                This website is free and open to all users and there is no login requirement. User cookies are not collected.
            </div>
        </div>
    </div>
    )
}

export default HomePage