import React from "react";
import './scoped.css'
import { Tag } from 'antd';

function Results(props) {
    const handleClick = () => {
        // console.log(props)
        props.article(props.id)
    }
    return (
        <div className="item-container">
            <h1 onClick = {handleClick} className="title">{props.title}</h1>
            <p className="description">{props.description}</p>
            <p className="pmid">PMID: {props.pmid}</p>
            <div className="Entities-Tag">
                {props.entities.map((entity, index) => {
                    return (
                        <Tag color="blue" className="entity">
                            {entity}
                        </Tag>
                    )
                })}
            </div>
            <div className="result-line"></div>
        </div>
    )
}

export default Results