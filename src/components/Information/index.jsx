import React, { useState, useEffect, useRef } from 'react'
import './scoped.css'
import { DetailService } from '../../service/Detail'
import { Descriptions, List, Collapse, Typography, Spin, Card, Tabs, Empty } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const { Panel } = Collapse;
const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Information = ({ width, ...props }) => {
    const informationClass = "information open";
    const relatedClass = "related open";
    const [nodeDetails, setNodeDetails] = useState({});
    const [nodeDetail, setNodeDetail] = useState({});
    const [edgeDetail, setEdgeDetail] = useState({});
    const [urlList, seturlList] = useState({});
    const [activeKey, setActiveKey] = useState(['0']);
    const [isLoading, setIsLoading] = useState(false);

    const merge = true;

    const handleCollapseChange = key => {
        console.log('Collapse change - new key:', key);
        setActiveKey(Array.isArray(key) ? key : [key]);
    };

    const handleClick = (event, link) => {
        event.preventDefault();
        window.open(link, '_blank');
    };

    useEffect(() => {
        setNodeDetail({});
        setEdgeDetail({});
        setNodeDetails({});
        console.log("detail changed");
        async function searchInfoNode(content) {
            setIsLoading(true);
            let detailServ = new DetailService()
            try {
                const response = await detailServ.Nid2Detail(content)
                setNodeDetail(response.data)
                setEdgeDetail({})
            } finally {
                setIsLoading(false);
            }
        }
        async function searchMergeInfoNode(content) {
            setIsLoading(true);
            let detailServ = new DetailService()
            try {
                const response = await detailServ.MergeNid2Detail(content)
                console.log(response)
                setNodeDetails(response.data);
                console.log(nodeDetails)
                setEdgeDetail({});
            } finally {
                setIsLoading(false);
            }
        }
        async function searchInfoEdge(content) {
            setIsLoading(true);
            console.log(content)
            let detailServ = new DetailService()
            try {
                const response = await detailServ.MergeEid2Detail(content)
                console.log(response.data)
                setEdgeDetail(response.data)
                setNodeDetails({})
            } finally {
                setIsLoading(false);
            }
        }
        if (props.detailId) {
            console.log(props.detailId)
            if (props.detailId[0] == "node") {
                if (!merge) {
                    searchInfoNode(props.detailId.slice(1))
                } else {
                    searchMergeInfoNode(props.detailId.slice(1))
                }
            }
            else {
                searchInfoEdge(props.detailId.slice(1));
            }
            setActiveKey(['2', '3', '0']);
        } else {
            setIsLoading(false);
        }
    }, [props.detailId]);

    useEffect(() => {
        if (Object.keys(nodeDetails).length !== 0 && nodeDetails[0] && nodeDetails[0][0]) {
            if (!('title' in nodeDetails[0][0])) {
                console.log('Regular node details loaded, setting activeKey to 0');
                setActiveKey(['0']);
            }
        }
    }, [nodeDetails]);

    useEffect(() => {
        if (Object.keys(edgeDetail).length > 0) {
            console.log('Edge detail loaded, setting activeKey to 0');
            setActiveKey(['0']);
        }
    }, [edgeDetail]);

    const displayArticleGraphRef = useRef(props.displayArticleGraph);
    const [, forceUpdate] = useState({});

    if (props.displayArticleGraph !== displayArticleGraphRef.current) {
        setNodeDetails({});
        setNodeDetail({});
        setEdgeDetail({});
        displayArticleGraphRef.current = props.displayArticleGraph;
        forceUpdate({}); // Force a render
        console.log("changed");
    }

    const formatAuthors = (authors) => {
        if (!authors) return 'N/A';
        
        if (!Array.isArray(authors)) {
            return authors.length > 50 ? authors.substring(0, 47) + '...' : authors;
        }

        let authorString = '';
        let moreAuthors = false;

        for (let author of authors) {
            if ((authorString + author).length > 47) {
                moreAuthors = true;
                break;
            }
            if (authorString) authorString += ', ';
            authorString += author;
        }

        if (moreAuthors) {
            authorString += '...';
        }

        return authorString;
    };

    const nodeForMap = (url) => {
        return (
            <div className="custom-div-url" style={{ paddingBottom: '8px' }}>
                <a 
                    href={url[1]} 
                    onClick={(event) => handleClick(event, url[1])}
                    style={{ color: '#4a7298' }}
                >
                    {url[0]}
                </a>
                <p className="info-row" style={{ color: '#555555', margin: '2px 0' }}>
                    <span title="Cited by">Cited by: {url[2]} </span> |
                    <span title="Year">Year: {url[3]} </span> |
                    <span title="Journal">Journal: {url[4].length > 20 ? url[4].substring(0, 20) + '...' : url[4]} </span>
                </p>
                <p className="info-row" title={url[5].join(', ')} style={{ color: '#555555', margin: '2px 0' }}>
                    Authors: {formatAuthors(url[5])}
                </p>
            </div>
        )
    }
    // if (Object.keys(nodeDetails).length !== 0) {
    //     const details = nodeDetails.map((nodeDetail) => nodeDetail.data)
    //     const urls = details.map((node) => node[1].map(nodeForMap))
    //     seturlList(urls)
    // }
    // console.log(urlList);
    const urls = Object.keys(nodeDetails).length !== 0 ? (nodeDetails[1].map(nodeForMap)) : []
    console.log(urls);
    // const edgeUrl = (url) => {
    //     return(
    //         <div>
    //             <a href={url[1]} onClick={(event) => handleClick(event, url[1])}>{url[0]}</a>
    //         </div>
    //     )
    // }
    // const edgeUrls = Object.keys(edgeDetail).length !== 0 ? edgeDetail[0][1].map(edgeUrl) : []
    // const edgeUrl = (url) => (
    //     <div>
    //         <a href={url[1]} onClick={(event) => handleClick(event, url[1])}>{url[0]}</a>
    //     </div>
    // );
    //
    // const edgeUrls = Object.keys(edgeDetail).length !== 0
    //     ? edgeDetail.map(edge =>
    //         edge[1].map(url => edgeUrl(url))
    //     )
    //     : [];



    function renderExternal() {
        if (Object.keys(nodeDetails).length !== 0) {
            let elements = []
            for (const nodeDetail of nodeDetails[0]) {
                for (const source of Object.keys(nodeDetail.external_sources)) {
                    console.log(nodeDetail.external_sources[source])
                    elements.push(
                        <div>
                            {source}: {nodeDetail.external_sources[source]}
                        </div>
                    );
                }
            }
            return elements;
        }
    }


    // if (Object.keys(nodeDetails).length !== 0) {
    //     (nodeDetails.map((nodeDetail) => nodeDetail.data)).map((node, index) => console.log(node[0].type))

    // }
    if (Object.keys(edgeDetail).length !== 0) {
        console.log(edgeDetail);

    }

    // Updated function to get the panel title
    const getPanelTitle = () => {
        if (Object.keys(edgeDetail).length > 0 && edgeDetail[0] && edgeDetail[0][0]) {
            const { node1, node2 } = edgeDetail[0][0];
            return `Relationship: ${node1} - ${node2}`;
        } else if (Object.keys(nodeDetails).length > 0 && nodeDetails[0] && nodeDetails[0][0]) {
            if ('database_id' in nodeDetails[0][0]) {
                // This is a regular node
                return nodeDetails[0][0].name;
            } else if ('pmid' in nodeDetails[0][0]) {
                // This is an article node
                return nodeDetails[0][0].title;
            }
        } else if (Object.keys(nodeDetail).length > 0 && nodeDetail[0]) {
            return nodeDetail[0].name;
        }
        return "Term/Relationship Details";
    };

    const LoadingMessage = () => (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            padding: '20px',
            flexDirection: 'column',
            gap: '10px',
            height: '100%',
            minHeight: '300px'  // Adjust this value based on your needs
        }}>
            <Spin size="large" />
            <Text>Loading details...</Text>
        </div>
    );

    const NoSelectionMessage = () => (
        <div className="no-selection-message">
            <Text>Select a node or edge to view details</Text>
        </div>
    );

    const renderNodeDetails = (node) => {
        // Check if this is an article node (has 'title' property)
        if ('title' in node) {
            return (
                <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '10px' }}>
                    <Descriptions.Item label="Title">{node.title}</Descriptions.Item>
                    <Descriptions.Item label="PubMedID">
                        <a 
                            href={`https://www.ncbi.nlm.nih.gov/pubmed/${node.pmid}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{ color: '#4a7298' }}
                        >
                            {node.pmid}
                        </a>
                    </Descriptions.Item>
                    <Descriptions.Item label="Authors">
                        {node.authors.join('; ')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Journal">{node.journal}</Descriptions.Item>
                    <Descriptions.Item label="Year">{node.date}</Descriptions.Item>
                    <Descriptions.Item label="Cited by">{node.n_citation}</Descriptions.Item>
                    {node.abstract && (
                        <Descriptions.Item label="Abstract">{node.abstract}</Descriptions.Item>
                    )}
                </Descriptions>
            );
        }
        
        // Regular node rendering
        return (
            <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '10px' }}>
                <Descriptions.Item label="Entity ID">{node.element_id}</Descriptions.Item>
                <Descriptions.Item label="Type">{node.type.join('; ')}</Descriptions.Item>
                {node.description && node.description.trim() !== "" && (
                    <Descriptions.Item label="Description">{node.description}</Descriptions.Item>
                )}
                {node.aliases && node.aliases.length > 0 && (
                    <Descriptions.Item label="Aliases">
                        {node.aliases.join('; ')}
                    </Descriptions.Item>
                )}
            </Descriptions>
        );
    };

    const renderArticleDetails = (article) => (
        <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '10px' }}>
            <Descriptions.Item label="Title">{article.title}</Descriptions.Item>
            <Descriptions.Item label="PubMedID">
                <a href={`https://www.ncbi.nlm.nih.gov/pubmed/${article.pmid}`} target="_blank" rel="noopener noreferrer">
                    {article.pmid}
                </a>
            </Descriptions.Item>
            <Descriptions.Item label="Authors">
                <ul>
                    {article.authors && article.authors.map((author, index) => (
                        <li key={index}>{author}</li>
                    ))}
                </ul>
            </Descriptions.Item>
            <Descriptions.Item label="Cited by">{article.n_citation}</Descriptions.Item>
            <Descriptions.Item label="Journal">{article.journal}</Descriptions.Item>
            <Descriptions.Item label="Abstract">{article.abstract}</Descriptions.Item>
        </Descriptions>
    );

    const renderEdgeDetails = (edge) => (
        <Descriptions column={1}>
            <Descriptions.Item label="Term 1">{edge.node1}</Descriptions.Item>
            <Descriptions.Item label="Term 2">{edge.node2}</Descriptions.Item>
            <Descriptions.Item label="Relationship Label">{edge['relationship label']}</Descriptions.Item>
            <Descriptions.Item label="Relationship Type">{edge['relationship type']}</Descriptions.Item>
            {edge['relationship label'] !== 'Curated_relationship' && (
                <Descriptions.Item label="Number of Citations">
                {edge['number of citations'] !== null ? edge['number of citations'] : 'N/A'}
            </Descriptions.Item>
            )}
            {edge['relationship label'] === 'Curated_relationship' && (
                <Descriptions.Item label="Source">{edge['source']}</Descriptions.Item>
            )}
            {edge.summary && (
                <Descriptions.Item label="Summary">{edge.summary}</Descriptions.Item>
            )}
        </Descriptions>
    );

    const showRelatedArticles = () => {
        if (Object.keys(edgeDetail).length !== 0) {
            return !edgeDetail.every(edge => edge[0]['relationship label'] === 'Curated_relationship');
        }
        return true;
    };

    return (
        <div className="information" style={{ width }}>
            <Card
                title={getPanelTitle()}
                className="information-content"
                headStyle={{
                    backgroundColor: '#4a7298',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                }}
                bodyStyle={{
                    padding: '16px',
                    backgroundColor: '#F7F7F7',
                    minHeight: '200px',
                }}
            >
                {!props.detailId ? (
                    <Empty description="Select a node or edge to view details" style={{ margin: '40px 0' }} />
                ) : isLoading ? (
                    <LoadingMessage />
                ) : (
                    <>
                        {/* Article Node Details - Direct Display */}
                        {Object.keys(nodeDetails).length !== 0 && nodeDetails[0] && nodeDetails[0][0] && 'title' in nodeDetails[0][0] && (
                            <div>
                                {renderNodeDetails(nodeDetails[0][0])}
                                {/* Related Articles for Article Node */}
                                {urls.length > 0 && (
                                    <div style={{ paddingLeft: '12px' }}>
                                        <h4 style={{ 
                                            color: '#8c8c8c', 
                                            marginTop: '20px', 
                                            marginBottom: '10px',
                                            fontWeight: 'normal',
                                            fontSize: '14px',
                                            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                                        }}>Related Articles</h4>
                                        <List
                                            size="small"
                                            dataSource={urls}
                                            renderItem={item => (
                                                <List.Item className="related-article-item">
                                                    {item}
                                                </List.Item>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Regular Node Details - Direct Display */}
                        {Object.keys(nodeDetails).length !== 0 && nodeDetails[0] && nodeDetails[0][0] && !('title' in nodeDetails[0][0]) && (
                            <div>
                                {nodeDetails[0].map((node, index) => (
                                    <div key={index}>
                                        {renderNodeDetails(node)}
                                        {/* Add Related Articles section for nodes */}
                                        {urls.length > 0 && (
                                            <div style={{ paddingLeft: '12px' }}>
                                                <h4 style={{ 
                                                    color: '#8c8c8c', 
                                                    marginTop: '20px', 
                                                    marginBottom: '10px',
                                                    fontWeight: 'normal',
                                                    fontSize: '14px',
                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                                                }}>Related Articles</h4>
                                                <List
                                                    size="small"
                                                    dataSource={urls}
                                                    renderItem={item => (
                                                        <List.Item className="related-article-item">
                                                            {item}
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Edge Details - With Collapse */}
                        {Object.keys(edgeDetail).length !== 0 && (
                            <Collapse 
                                accordion 
                                activeKey={activeKey}
                                onChange={handleCollapseChange}
                            >
                                {edgeDetail.map((edge, index) => (
                                    <Panel 
                                        header={<span>Relationship {index + 1}: <i>{edge[0]['relationship type']}</i></span>} 
                                        key={`${index}`}
                                    >
                                        {/* Edge Details */}
                                        {renderEdgeDetails(edge[0])}

                                        {/* Related Sentences */}
                                        {edge[2] && edge[2].length > 0 && (
                                            <div>
                                                <h4 style={{ 
                                                    color: '#8c8c8c', 
                                                    marginTop: '20px', 
                                                    marginBottom: '10px',
                                                    fontWeight: 'normal',
                                                    fontSize: '14px',
                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                                                }}>Related Sentences</h4>
                                                <List
                                                    size="small"
                                                    dataSource={edge[2]}
                                                    renderItem={(item, index) => (
                                                        <List.Item key={index} className="related-article-item" style={{ paddingBottom: '8px' }}>
                                                            <div className="custom-div-edge">
                                                                <div style={{ whiteSpace: 'pre-wrap' }}>{item[0]}</div>
                                                                <p className="info-row" style={{ color: '#555555', margin: '2px 0' }}>
                                                                    <a 
                                                                        href={item[1]} 
                                                                        onClick={(event) => handleClick(event, item[1])}
                                                                        style={{ color: '#4a7298' }}
                                                                    >
                                                                        View Source
                                                                    </a>
                                                                </p>
                                                            </div>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        )}

                                        {/* Related Articles */}
                                        {edge[1] && edge[1].length > 0 && (
                                            <div>
                                                <h4 style={{ 
                                                    color: '#8c8c8c', 
                                                    marginTop: '20px', 
                                                    marginBottom: '10px',
                                                    fontWeight: 'normal',
                                                    fontSize: '14px',
                                                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif'
                                                }}>Related Articles</h4>
                                                <List
                                                    size="small"
                                                    dataSource={edge[1]}
                                                    renderItem={(url, urlIndex) => (
                                                        <List.Item key={urlIndex} className="related-article-item" style={{ paddingBottom: '8px' }}>
                                                            <div className="custom-div-edge">
                                                                <a 
                                                                    href={url[1]} 
                                                                    onClick={(event) => handleClick(event, url[1])}
                                                                    style={{ color: '#4a7298' }}
                                                                >
                                                                    {url[0]}
                                                                </a>
                                                                <p className="info-row" style={{ color: '#555555', margin: '2px 0' }}>
                                                                    <span title="Cited by">Cited by: {url[2]} </span> | 
                                                                    <span title="Year">Year: {url[3]} </span> | 
                                                                    <span title="Journal">Journal: {url[4].length > 20 ? url[4].substring(0, 20) + '...' : url[4]} </span>
                                                                </p>
                                                                <p className="info-row" title={url[5].join(', ')} style={{ color: '#555555', margin: '2px 0' }}>
                                                                    Authors: {formatAuthors(url[5])}
                                                                </p>
                                                            </div>
                                                        </List.Item>
                                                    )}
                                                />
                                            </div>
                                        )}
                                    </Panel>
                                ))}
                            </Collapse>
                        )}
                    </>
                )}
            </Card>
        </div>
    );
};

export default Information;
