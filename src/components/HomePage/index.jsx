import 'antd/dist/reset.css';
import './scoped.css';

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Typography,
} from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';


const RECENT_PLACEHOLDER = 'The role of BRCA1 in breast cancer with';

const HomePage = () => {
    const navigate = useNavigate();
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarExpanded((prev) => !prev);
    };

    const handleSearchClick = () => {
        navigate('/chat');
    };

    const handleShortcutClick = () => {
        navigate('/chat');
    };

    return (
        <>
            <Helmet>
                <title>GLKB | AI-Powered Genomics Search</title>
                <meta
                    name="description"
                    content="Discover insights from genomic research with AI-powered search and analysis."
                />
                <meta
                    property="og:title"
                    content="Home Page - Genomic Literature Knowledge Base"
                />
            </Helmet>
            <div className={`landing-root ${isSidebarExpanded ? 'landing-root-expanded' : ''}`}>
                <div className={`landing-sidebar ${isSidebarExpanded ? 'landing-sidebar-expanded' : ''}`}>
                    <div className="landing-sidebar-top">
                        {isSidebarExpanded ? (
                            <>
                                <div className="landing-logo-expanded-wrap">
                                    <img src="/glkb_logo_expanded.png" alt="GLKB" className="landing-logo-img" />
                                </div>
                                <button
                                    type="button"
                                    className="landing-collapse-button"
                                    onClick={toggleSidebar}
                                    aria-label="Collapse sidebar"
                                >
                                    <img src="/icons/sidebar_left.svg" alt="" className="landing-collapse-icon" />
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                className="landing-logo-button"
                                onClick={toggleSidebar}
                                title="Expand sidebar"
                                aria-label="Expand sidebar"
                            >
                                <img
                                    src="/GLKB_logo_icon.png"
                                    alt="GLKB"
                                    className="landing-logo-icon"
                                />
                            </button>
                        )}
                    </div>
                    <div className="landing-sidebar-body">
                        <div className="landing-sidebar-nav">
                            <div className="landing-sidebar-nav-item">
                                <button
                                    type="button"
                                    className="landing-sidebar-icon-button"
                                    aria-label="New Chat"
                                >
                                    <span className="landing-sidebar-icon">
                                        <AddIcon fontSize="small" />
                                    </span>
                                </button>
                                <span className="landing-sidebar-label">New Chat</span>
                            </div>
                            <div className="landing-sidebar-separator" />
                            <div className="landing-sidebar-nav-item">
                                <button
                                    type="button"
                                    className="landing-sidebar-icon-button"
                                    aria-label="Explore"
                                >
                                    <span className="landing-sidebar-icon">
                                        <img src="/icons/category_search.svg" alt="" className="landing-sidebar-nav-icon-img" />
                                    </span>
                                </button>
                                <span className="landing-sidebar-label">Explore</span>
                            </div>
                            <div className="landing-sidebar-nav-item">
                                <button
                                    type="button"
                                    className="landing-sidebar-icon-button"
                                    aria-label="Api"
                                >
                                    <span className="landing-sidebar-icon">
                                        <img src="/icons/code_blocks.svg" alt="" className="landing-sidebar-nav-icon-img" />
                                    </span>
                                </button>
                                <span className="landing-sidebar-label">Api</span>
                            </div>
                            <div className="landing-sidebar-nav-item">
                                <button
                                    type="button"
                                    className="landing-sidebar-icon-button"
                                    aria-label="Library"
                                >
                                    <span className="landing-sidebar-icon">
                                        <img src="/icons/book_4.svg" alt="" className="landing-sidebar-nav-icon-img" />
                                    </span>
                                </button>
                                <span className="landing-sidebar-label">Library</span>
                            </div>
                            <div className="landing-sidebar-nav-item">
                                <button
                                    type="button"
                                    className="landing-sidebar-icon-button"
                                    aria-label="History"
                                >
                                    <span className="landing-sidebar-icon">
                                        <HistoryOutlinedIcon fontSize="small" />
                                    </span>
                                </button>
                                <span className="landing-sidebar-label">History</span>
                            </div>
                        </div>
                        <div className="landing-sidebar-recent">
                            <p className="landing-sidebar-recent-title">Recent</p>
                            <div className="landing-sidebar-recent-list">
                                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        className={`landing-sidebar-recent-item ${i === 2 ? 'landing-sidebar-recent-item-active' : ''}`}
                                    >
                                        {RECENT_PLACEHOLDER}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="landing-sidebar-footer">
                        <div className={`landing-avatar ${isSidebarExpanded ? 'landing-avatar-large' : ''}`} />
                        <div className="landing-footer-text">
                            <span className="landing-footer-name">Sofia Alvarez</span>
                            <span className="landing-footer-plan">Free plan</span>
                        </div>
                    </div>
                </div>
                <div className="landing-main">
                    <Box className="landing-center">
                        <Box className="landing-text">
                            <Typography
                                className="landing-title"
                                component="h1"
                                sx={{
                                    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '36px',
                                    lineHeight: 1.2,
                                    color: '#164563',
                                }}
                            >
                                Ask. Answer. Cite.
                            </Typography>
                            <Typography
                                className="landing-subtitle"
                                component="p"
                                sx={{
                                    fontFamily: '"DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                                    fontWeight: 600,
                                    fontSize: '16px',
                                    lineHeight: 1.3,
                                    color: '#646464',
                                    maxWidth: '713px',
                                }}
                            >
                                Discover insights from genomic research with AI-powered search and analysis
                            </Typography>
                        </Box>
                        <Box className="landing-search-card">
                            <Box className="landing-search-inner">
                                <Typography className="landing-search-placeholder">
                                    Ask a question about the biomedical literature...
                                </Typography>
                            </Box>
                            <Box className="landing-search-footer">
                                <button
                                    type="button"
                                    className="landing-search-button"
                                    onClick={handleSearchClick}
                                >
                                    <SearchIcon />
                                </button>
                            </Box>
                        </Box>
                        <Box className="landing-pills-row">
                            <button
                                type="button"
                                className="landing-pill"
                                onClick={handleShortcutClick}
                            >
                                <span className="landing-pill-icon">
                                    <img src="/icons/insight.svg" alt="" className="landing-pill-icon-img" />
                                </span>
                                <span className="landing-pill-label">Gene insight</span>
                            </button>
                            <button
                                type="button"
                                className="landing-pill"
                                onClick={handleShortcutClick}
                            >
                                <span className="landing-pill-icon">
                                    <img src="/icons/insigh.svg" alt="" className="landing-pill-icon-img" />
                                </span>
                                <span className="landing-pill-label">Disease insight</span>
                            </button>
                            <button
                                type="button"
                                className="landing-pill"
                                onClick={handleShortcutClick}
                            >
                                <span className="landing-pill-icon">
                                    <img src="/icons/review.svg" alt="" className="landing-pill-icon-img" />
                                </span>
                                <span className="landing-pill-label">Literature Review</span>
                            </button>
                            <button
                                type="button"
                                className="landing-pill"
                                onClick={handleShortcutClick}
                            >
                                <span className="landing-pill-icon">
                                    <img src="/icons/use_cases.svg" alt="" className="landing-pill-icon-img" />
                                </span>
                                <span className="landing-pill-label">Use Cases</span>
                            </button>
                        </Box>
                    </Box>
                    <button
                        type="button"
                        className="landing-help-button"
                        aria-label="Help"
                    >
                        <HelpOutlineIcon />
                    </button>
                </div>
            </div>
        </>
    );
};

export default HomePage;

