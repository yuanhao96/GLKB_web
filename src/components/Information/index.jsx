import './scoped.css';

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  Card,
  Collapse,
  Descriptions,
  Empty,
  List,
  Select,
  Spin,
  Typography,
} from 'antd';

import downArrow from '../../img/down_arrow.svg';
import rightArrow from '../../img/right_arrow.svg';
import { DetailService } from '../../service/Detail';

const { Panel } = Collapse;
const { Text } = Typography;

const Information = ({ width, ...props }) => {
    const informationClass = "information open";
    const relatedClass = "related open";
    const [nodeDetails, setNodeDetails] = useState({});
    const [nodeDetail, setNodeDetail] = useState({});
    const [edgeDetail, setEdgeDetail] = useState({});
    const [activeKey, setActiveKey] = useState(['0']);
    const [isLoading, setIsLoading] = useState(false);
    const [sentenceVisibility, setSentenceVisibility] = useState({});

    const merge = true;

    const handleCollapseChange = key => {
        console.log('Collapse change - new key:', key);
        setActiveKey(Array.isArray(key) ? key : [key]);
    };

    const handleClick = (event, link) => {
        event.preventDefault();
        window.open(link, '_blank');
    };

    const toggleSentences = (index) => {
        setSentenceVisibility(prev => ({
            ...prev,
            [index]: !prev[index],
        }));
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
        const authors = url[5] || [];
        const getLastName = (fullName) => {
            const parts = fullName.trim().split(' ');
            return parts[parts.length - 1];
        };

        const renderAuthors = () => {
            if (authors.length === 0) return null;
            if (authors.length === 1) {
                return renderAuthorBubbles([authors[0]]);
            }
            if (authors.length === 2) {
                return renderAuthorBubbles(authors);
            }
            return renderAuthorBubbles([
                authors[0],
                '...',
                authors[authors.length - 1]
            ]);
        };
        const renderAuthorBubbles = (list) => (
            list.map((author, idx) => (
                <span
                    key={idx}
                >
                    {author}{idx < list.length - 1 ? ',' : ''}
                </span>
            ))
        );
        return (
            <div
                onClick={(event) => handleClick(event, url[1])}
                className="custom-div-url"
                style={{
                    cursor: 'pointer',
                    marginBottom: '2px',
                    borderRadius: '10px',
                    padding: 0,
                    backgroundColor: '#fff',
                    width: '100%',
                }}
            >
                {/* Section 1: PubMed ID and Citations */}
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ color: '#018DFF', fontSize: '14px' }}>
                        PubMed ID: {url[1].split('/').filter(Boolean).pop()}
                    </div>
                    <div style={{ fontSize: '14px' }}>
                        Citations: {url[2]}
                    </div>
                </div>

                {/* Section 2: Title and Year */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto',
                    alignItems: 'start',
                }}>
                    <a
                        href={url[1]}
                        onClick={(event) => {
                            event.stopPropagation();
                            handleClick(event, url[1]);
                        }}
                        style={{
                            color: 'black',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '14px',
                            paddingRight: '8px',
                            wordBreak: 'break-word'
                        }}
                    >
                        {url[0]}
                    </a>
                    <div style={{
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        textAlign: 'right',
                        marginLeft: '8px',
                    }}>
                        {url[3]}
                    </div>
                </div>

                {/* Section 3: Authors */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '6px',
                    fontSize: '14px'
                }}>
                    {renderAuthors()}
                </div>

                {/* Section 4: Journal Name */}
                <div style={{
                    fontSize: '14px',
                    wordBreak: 'break-word',
                    color: 'grey',
                }} title="Journal">
                    {url[4]}
                </div>
            </div>


        )
    }


    const [sortBy, setSortBy] = useState('year'); // 'year' or 'citations'

    const sortedRawNodes = useMemo(() => {
        if (!nodeDetails[1]) return [];
        return [...nodeDetails[1]].sort((a, b) => {
            if (sortBy === 'year') return parseInt(b[3]) - parseInt(a[3]);
            if (sortBy === 'citations') return parseInt(b[2]) - parseInt(a[2]);
            return 0;
        });
    }, [nodeDetails, sortBy]);

    const urls = sortedRawNodes.map(nodeForMap);

    const sortedUrls = useMemo(() => {

        return [...urls].sort((a, b) => {
            if (sortBy === 'year') {
                return parseInt(b[3]) - parseInt(a[3]); // Newest first
            } else if (sortBy === 'citations') {
                return parseInt(b[2]) - parseInt(a[2]); // Most cited first
            }
            return 0;
        });
    }, [urls, sortBy]);


    const sortedEdges = useMemo(() => {
        if (!edgeDetail || typeof edgeDetail !== 'object') return [];

        return Object.entries(edgeDetail).map(([label, urlsWrapper]) => {
            const urls = urlsWrapper?.[1] || [];

            const sortedUrls = [...urls].sort((a, b) => {
                if (sortBy === 'year') {
                    return parseInt(b[3]) - parseInt(a[3]);
                } else if (sortBy === 'citations') {
                    return parseInt(b[2]) - parseInt(a[2]);
                }
                return 0;
            });

            return [label, [urlsWrapper[0], sortedUrls]];
        });
    }, [edgeDetail, sortBy]);

    const edgeItems = useMemo(() => {
        return sortedEdges.flatMap((edge) => {
            return edge?.[1]?.[1]?.map(nodeForMap) || [];
        });
    }, [sortedEdges]);
    // if (Object.keys(nodeDetails).length !== 0) {
    //     const details = nodeDetails.map((nodeDetail) => nodeDetail.data)
    //     const urls = details.map((node) => node[1].map(nodeForMap))
    //     seturlList(urls)
    // }
    // console.log(urlList);
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
        return " ";
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
                <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '30px' }}>
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
            <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '30px' }}>
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
        <Descriptions column={1} size="small" className="custom-descriptions" style={{ borderRadius: '30px' }}>
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
        <Descriptions column={1} >
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
        <div className="information" style={{
            fontFamily: 'Inter !important',
            "& .ant-list-item": {
                paddingLeft: '0px',
                paddingRight: '0px',
            }
        }}>
            <Card
                title={getPanelTitle()}
                className="information-content"

                styles={{
                    header: {
                        color: 'black',
                        fontSize: '24px',
                        lineHeight: '1.5',
                        fontWeight: '600',
                        fontFamily: 'Inter',
                        borderTopLeftRadius: '10px',
                        borderTopRightRadius: '10px',
                        paddingTop: '35px',
                        //paddingLeft: "2.5vw",
                        // marginLeft:"2.6vw",
                        // paddingBottom: '20px',
                        minHeight: '90px',
                        border: 'none',
                        background: 'transparent',
                        wordWrap: 'break-word !important',
                        whiteSpace: 'pre-wrap',
                    },
                    body: {
                        padding: '0px',
                        backgroundColor: '#F7F7F7',
                        minHeight: '200px',
                        // marginTop: '20px',
                        marginBottom: '10px',
                        border: 'none',
                        background: 'transparent',
                    },

                }}
            >
                {!props.detailId ? (
                    <Empty description="Select a node or edge to view details" style={{
                        position: 'absolute',
                        bottom: '50%',
                        left: '50%',
                        transform: 'translate(-50%, 50%)',
                    }} />
                ) : isLoading ? (
                    <LoadingMessage />
                ) : (
                    <div style={{ position: 'relative', height: '100%' }}>
                        <div className="transcriptGradientTop"></div>
                        <div style={{ paddingLeft: '2vw', paddingRight: '2vw', paddingTop: '0px', paddingBottom: '20px', overflowY: 'auto', maxHeight: '100%' }}>

                            {/* Article Node Details - Direct Display */}
                            {Object.keys(nodeDetails).length !== 0 && nodeDetails[0] && nodeDetails[0][0] && 'title' in nodeDetails[0][0] && (
                                <div>
                                    {renderNodeDetails(nodeDetails[0][0])}
                                    {/* Related Articles for Article Node */}
                                    {urls.length > 0 && (
                                        <div style={{ paddingLeft: '12px' }}>
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                marginBottom: '10px'
                                            }}>
                                                <h4 style={{
                                                    color: '#8c8c8c',
                                                    margin: 0,
                                                    fontWeight: 'normal',
                                                    fontSize: '14px',
                                                }}>Related Articles</h4>
                                                <Select
                                                    size="small"
                                                    defaultValue="year"
                                                    onChange={value => setSortBy(value)}
                                                    style={{ width: 120 }}
                                                    options={[
                                                        { value: 'year', label: 'Sort by Year' },
                                                        { value: 'citations', label: 'Sort by Citations' },
                                                    ]}
                                                />
                                            </div>
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
                                                <div style={{}}>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '10px'
                                                    }}>
                                                        <h4 style={{
                                                            color: '#8c8c8c',
                                                            margin: 0,
                                                            fontWeight: 'normal',
                                                            fontSize: '14px',
                                                        }}>Related Articles</h4>
                                                        <Select
                                                            size="small"
                                                            value={sortBy}
                                                            onChange={value => setSortBy(value)}
                                                            options={[
                                                                { value: 'year', label: 'Sort by Year' },
                                                                { value: 'citations', label: 'Sort by Citations' }
                                                            ]}
                                                        />
                                                    </div>
                                                    <List
                                                        size="small"
                                                        dataSource={sortedUrls}
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
                                                    <div style={{
                                                        display: 'flex',
                                                        // justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginTop: '20px',
                                                        marginBottom: '10px',
                                                        position: sentenceVisibility[index] ? 'sticky' : 'static',
                                                        top: 0,
                                                        backgroundColor: 'white',
                                                        zIndex: 10,
                                                        padding: '8px 0',
                                                    }}>
                                                        <h4 style={{
                                                            color: '#8c8c8c',
                                                            margin: 0,
                                                            fontWeight: 'normal',
                                                            fontSize: '14px',
                                                        }}>Related Sentences</h4>
                                                        <div onClick={() => toggleSentences(index)} style={{ cursor: 'pointer', marginLeft: '20px' }}>
                                                            <img
                                                                src={sentenceVisibility[index] ? downArrow : rightArrow}
                                                                alt="Toggle related sentences"
                                                                className="legend-toggle-icon"
                                                            />
                                                        </div>
                                                    </div>

                                                    {sentenceVisibility[index] && (
                                                        <List
                                                            size="small"
                                                            dataSource={edge[2]}
                                                            renderItem={(item, i) => (
                                                                <List.Item key={i} className="related-article-item" style={{ paddingBottom: '8px' }}>
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
                                                    )}
                                                </div>
                                            )}

                                            {/* Related Articles */}
                                            {edge[1] && edge[1].length > 0 && (
                                                <div>
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                        marginBottom: '10px',
                                                        marginTop: '8px'
                                                    }}>
                                                        <h4 style={{
                                                            color: '#8c8c8c',
                                                            margin: 0,
                                                            fontWeight: 'normal',
                                                            fontSize: '14px',
                                                        }}>Related Articles</h4>
                                                        <Select
                                                            size="small"
                                                            value={sortBy}
                                                            onChange={value => setSortBy(value)}
                                                            options={[
                                                                { value: 'year', label: 'Sort by Year' },
                                                                { value: 'citations', label: 'Sort by Citations' }
                                                            ]}
                                                        />
                                                    </div>
                                                    <List
                                                        size="small"
                                                        dataSource={edgeItems}
                                                        renderItem={(item) => (
                                                            <List.Item className="related-article-item">
                                                                {item}
                                                            </List.Item>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                        </Panel>
                                    ))}
                                </Collapse>
                            )}
                        </div>
                        <div className="transcriptGradientBottom"></div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Information;
