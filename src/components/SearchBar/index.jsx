//SearchBar.js

import React, { useState, useRef, useEffect } from 'react';

const SearchBar = (props) =>{
    const [input, setInput] = useState('');
    const [tags, setTags] = useState(props.tags);
    const inputRef = useRef(null);

    const handleInputChange = (e) => {
        setInput(e.target.textContent);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (input.trim()) {
                // If there is input, create a bubble
                setTags([...tags, input.trim()]);
                setInput('');
                e.target.textContent = '';
            } else if (tags.length > 0) {
                // If there is no input but there are tags, trigger search
                handleSearch();
            }
            else if (tags.length === 0) {
                window.location.href ="/";
                return;
            }
        } else if (e.key === 'Backspace' && !input) {
            // Delete the last tag if there is no input
            e.preventDefault();
            setTags(tags.slice(0, -1));
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [tags]);

    const handleSearch = () => {
        if (tags.length === 0) {
            // Redirect to the homepage
            // Assuming you are using React Router for navigation
            // this.props.history.push('google.com');
            window.location.href ="/";
            return; // Stop further execution
        }
        // Perform search using the tags array
        console.log(tags.join("|"));
        props.setTags(tags)
        // Implement the search logic here
        // Clear the tags if needed after search
        props.handleSearchTags(tags.join("|"))
        // setTags([]);
    };

    console.log(tags)

    return (
        <div className="center-section">
            <div className="search-input" onClick={() => inputRef.current && inputRef.current.focus()}>
                {tags.map((tag, index) => (
                    <span key={index} className="search-tag">
                                {tag}
                        <span className="delete-tag" onClick={() => setTags(tags.filter((_, i) => i !== index))}>&times;</span>
                            </span>
                ))}
                <span
                    ref={inputRef}
                    contentEditable
                    className="editable-input"
                    onInput={handleInputChange}
                    onKeyDown={handleKeyDown}
                    role="textbox"
                    aria-multiline="false"
                />
            </div>
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    );
};

export default SearchBar;