import React, { useEffect } from "react";
import './scoped.css'
import { Checkbox, Row, Col } from 'antd';
import { useState } from "react";

function Term(props) {
    return (
        <div className="term-container">
            <Row className="termClass">
                <Col className="termTitle" span={10}>Entity ID:</Col>
                <Col className="termContent" span={14}>{props.entity_id}</Col>
            </Row>
            <Row className="termClass">
                <Col className="termTitle" span={10}>Name:</Col>
                <Col className="termContent" span={14}>{props.name}</Col>
            </Row>
            <Row className="termClass">
                <Col className="termTitle" span={10}>Aliases:</Col>
                <Col className="termContent" span={14}>
                    {(props.aliases.map((alias, index) => {
                        return (
                        <span>
                            {alias}; 
                        </span>
                        )
                    }))}
                </Col>
            </Row>
            <Row className="termClass">
                <Col className="termTitle" span={10}>Description:</Col>
                <Col className="termContent" span={14}>{props.description}</Col>
            </Row>
            <Row className="termClass">
                <Col className="termTitle" span={10}>Type:</Col>
                <Col className="termContent" span={14}>
                {(props.type.map((temp_type, index) => {
                        return (
                        <span>
                            {temp_type}; 
                        </span>
                        )
                    }))}
                </Col>
            </Row>
            <Row className="termClass">
                <Col className="termTitle" span={10}>External ID:</Col>
                <Col className="termContent" span={14}>
                {Object.entries(props.external_id).map(([key, values]) => (
                    <Row>
                        <Col>{key}: </Col>
                        <Col>
                        {values.map((value, index) => (
                            <span>{value};</span>
                        ))}
                        </Col>
                    </Row>
                ))}
                </Col>
            </Row>
        </div>
    )
}

export default Term