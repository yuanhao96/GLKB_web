import React, { useEffect, useState } from 'react'
import './scoped.css'
import { Row, Col, Slider, Collapse, Transfer, InputNumber, Typography, Button, Modal, Tree, Input, Menu, Checkbox, Dropdown, Space, Spin, Card } from 'antd';
import { DownOutlined, SmileOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { CaretRightOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { NewGraph } from '../../service/NewNode'
import { CypherService } from '../../service/Cypher'
import { render } from '@testing-library/react';
import { Tooltip } from 'antd';
const { Panel } = Collapse;
const { Title } = Typography;

const Filter = props => {
    const graphNodes = [];
    let uniqueLabelsSet;
    let currentLabelsSet;
    let uniqueEdgeLabelsSet;
    let currentEdgeLabelsSet;
    if (props.data.edges) {
        uniqueEdgeLabelsSet = new Set(props.data.edges.map(edge => edge.data.label));
    }
    if (props.data.nodes) {
        uniqueLabelsSet = new Set(props.data.nodes.map(node => node.data.label));
        //setUniqueLabelsArray([...uniqueLabelsSet]);
        for (let i = 0; i < props.data.nodes.length; i++) {
            graphNodes.push(props.data.nodes[i].data.id)
        }
    }
    let existingNodes = []
    const groupedNodes = {}
    if (props.allNodes.length != 0) {
        console.log(props.allNodes)
        props.allNodes.forEach((node, index) => {
            const type = node.type.split(';')[0];
            if (!groupedNodes[type]) {
                groupedNodes[type] = { key: type, title: type, children: [] };
            }
            groupedNodes[type].children.push({ key: node.id, title: node.name, icon: <PlusCircleOutlined style={{ color: 'green' }} /> });
        });

        existingNodes = Object.values(groupedNodes);
    }
    let initRightTreeData = [];
    useEffect(() => {
        if (props.graphShownData != {}) {
            initRightTreeData = []
            if (props.graphShownData.nodes) {
                for (let i = 0; i < props.graphShownData.nodes.length; i++) {
                    const node = props.graphShownData.nodes[i];
                    const label = node.data.label;
                    const newNode = { key: node.data.id, title: node.data.display, icon: <MinusCircleOutlined style={{ color: 'red' }} /> };

                    const labelData = initRightTreeData.find(group => group.key === label);

                    if (labelData) {
                        labelData.children.push(newNode);
                    } else {
                        initRightTreeData.push({ key: label, title: label, children: [newNode] });
                    }
                }
            }
            setRightData(initRightTreeData)
        }
    }, [props.graphShownData])

    async function entityToArticle(content) {
        let cypherServ = new CypherService()
        const response = await cypherServ.Term2Article(content)
        console.log('Term2Article -> ', response)
        props.setData(response)
    }

    async function articleToEntity() {
        props.search(props.search_data);
    }

    /* source is visible nodes, target is invisible nodes */
    const [displayLeftTree, setDisplayLeftTree] = useState(true);
    const [expandedKeys, setExpandedKeys] = useState([]);
    const [autoExpandParent, setAutoExpandParent] = useState(false);
    const [checkedKeys, setCheckedKeys] = useState(graphNodes);
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [leftData, setLeftData] = useState(existingNodes);
    const [rightData, setRightData] = useState(initRightTreeData)
    const [newList, setNewList] = useState();
    const [uniqueLabelsArray, setUniqueLabelsArray] = useState([...uniqueLabelsSet]);
    const [uniqueEdgeLabelsArray, setUniqueEdgeLabelsArray] = useState([...uniqueEdgeLabelsSet])

    const toggleTreeDisplay = () => {
        setDisplayLeftTree((prevDisplayLeftTree) => !prevDisplayLeftTree);
    };

    const currentTreeData = displayLeftTree ? leftData : rightData;

    const boolValues = {};
    const boolEdgeValues = {};
    currentLabelsSet = new Set(props.graphShownData.nodes.map(node => node.data.label));
    currentEdgeLabelsSet = new Set(props.graphShownData.edges.map(edge => edge.data.label));
    uniqueEdgeLabelsArray.forEach(label => {
        if (currentEdgeLabelsSet) {
            if (currentEdgeLabelsSet.has(label))
                boolEdgeValues[label] = true;
            else
                boolEdgeValues[label] = false;
        } else {
            boolEdgeValues[label] = true;
        }
    });
    uniqueLabelsArray.forEach(label => {
        if (currentLabelsSet) {
            if (currentLabelsSet.has(label))
                boolValues[label] = true;
            else
                boolValues[label] = false;
        } else {
            boolValues[label] = true;
        }
    });



    const existingNodeList = []
    for (var i = 0; i < rightData.length; i++) {
        existingNodeList.push(rightData[i].children.map(child => child.key).join('|'))
    }
    const existing = existingNodeList.join('|')

    const onChangeNode = (e) => {
        if (!e.target.checked) {
            const tempKeys = [];
            for (let i = 0; i < props.graphShownData.nodes.length; i++) {
                if (props.graphShownData.nodes[i].data.label != e.target.value) {
                    tempKeys.push(props.graphShownData.nodes[i].data.id);
                }
            }
            setCheckedKeys(tempKeys);
            props.setGraphData(tempKeys);
            boolValues[e.target.value] = false;
        } else {
            var tempKeys = [];
            for (let i = 0; i < props.data.nodes.length; i++) {
                if (props.data.nodes[i].data.label == e.target.value) {
                    tempKeys.push(props.data.nodes[i].data.id);
                }
            }
            checkedKeys.forEach(id => tempKeys.push(id));
            setCheckedKeys(tempKeys);
            props.setGraphData(tempKeys);
            boolValues[e.target.value] = true;
        }
    }

    const LegendItem = ({ label, size, color, explanation }) => {
        const isQueryTerms = label === 'query terms';
        const isRelationship = label.includes("relationship");

        return (
            <div className="legend-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {isRelationship ? (
                        <div style={{ marginLeft: "0px", width: "30px", height: "0", borderBottom: '0.5px black', borderBottom: size }}></div>
                    ) : (
                        <div className="legend-circle" style={{ backgroundColor: color, width: size, height: size, marginLeft: size === 5 ? "6px" : size === 10 ? "4px" : "0" }}></div>
                    )}
                    <div className="legend-label" style={{ marginLeft: '10px' }}>
                        {label}
                        {isRelationship && (
                            <Tooltip title={explanation}>
                                <InfoCircleOutlined style={{ marginLeft: '5px', color: '#1890ff' }} />
                            </Tooltip>
                        )}
                    </div>
                </div>
                {!isRelationship && (
                    <Checkbox value={label} defaultChecked={boolValues[label]} onChange={onChangeNode}></Checkbox>
                )}
            </div>
        );
    };

    const shapeData = [
        { label: 'query terms', size: 20, color: '#A9A9A9' },
        { label: 'non-query terms', size: 20, color: '#A9A9A9' },
    ]

    const sizeData = [
        { label: 'frequency < 30', size: 5, color: '#A9A9A9' },
        { label: '30 <= frequency < 60', size: 10, color: '#A9A9A9' },
        { label: 'frequency >= 60', size: 20, color: '#A9A9A9' }
    ];

    const legendDataAll = [
        { label: 'AnatomicalEntity', size: 20, color: '#374B73' },        // Navy blue
        { label: 'ChemicalEntity', size: 20, color: '#94B0DA' },          // Light blue
        { label: 'DiseaseOrPhenotypicFeature', size: 20, color: '#E3E8F0' }, // Pale blue
        { label: 'Gene', size: 20, color: '#E07A5F' },                    // Coral/salmon
        { label: 'BiologicalProcessOrActivity', size: 20, color: '#3D405B' }, // Dark slate
        { label: 'MeshTerm', size: 20, color: '#81B29A' },               // Sage green
        { label: 'SequenceVariant', size: 20, color: '#F2CC8F' },        // Warm sand
        { label: 'Article', size: 20, color: '#C4C4C4' },                // Light grey
    ]

    const edgeDataAll = [
        { label: 'Semantic_relationship', size: 'solid', color: 'black', explanation: 'Relationships extracted from PubMed abstracts.' },
        { label: 'Curated_relationship', size: 'dashed', color: 'black', explanation: 'Manually annotated relationships from data repositories.' },
        { label: 'Hierarchical_relationship', size: 'dotted', color: 'black', explanation: 'Relationships that represent a hierarchy.' },
    ]

    const legendData = legendDataAll.filter(item => uniqueLabelsArray.includes(item.label));
    const legendEdgeData = edgeDataAll.filter(item => uniqueEdgeLabelsArray.includes(item.label));
    const onExpand = (expandedKeysValue) => {
        setExpandedKeys(expandedKeysValue);
        setAutoExpandParent(false);
    };

    const onCheck = (checkedKeysValue) => {
        if (newList) {
            const tempKeys = []
            for (var i = 0; i < newList.length; i++) {
                for (var j = 0; j < newList[i].children.length; j++) {
                    tempKeys.push(newList[i].children[j].key)
                }
            }
            console.log(checkedKeys)
            const tempCheckedKeys = checkedKeys.filter(key => tempKeys.includes(key))
            setCheckedKeys(checkedKeys.filter(key => !tempCheckedKeys.includes(key)).concat(checkedKeysValue));
            console.log(checkedKeys);
            return;
        }
        setCheckedKeys(checkedKeysValue);
        props.setGraphData(checkedKeysValue)
    };

    const onSelect = (selectedKeysValue, info) => {
        setSelectedKeys(selectedKeysValue);
        props.handleSelectNodeID(selectedKeysValue);
    };

    const buttonClick = () => {
        const existingList = existing.split('|')
        const filteredList = checkedKeys.filter(item => !isNaN(item))
        const newNode = filteredList.filter(id => !existingList.includes(id)).join('|')
        if (newNode) {
            console.log(newNode)
            drawNewGraph(existing, newNode)
        }
        props.setGraphData(checkedKeys)
    }

    async function drawNewGraph(existing, newNode) {
        let detailServ = new NewGraph()
        const response = await detailServ.AddNodes(existing, newNode)
        console.log(response)
        const newData = JSON.parse(JSON.stringify(props.data));
        for (var i = 0; i < response.data.nodes.length; i++) {
            newData.nodes.push({ 'data': response.data.nodes[i] })
        }
        for (var i = 0; i < response.data.links.length; i++) {
            newData.edges.push({ 'data': response.data.links[i] })
        }
        props.setData(newData)
    }

    // const onCheckHandler = displayLeftTree ? onCheck : undefined;
    // const checkedKeysHandler = displayLeftTree ? checkedKeys : undefined;
    // const onSelectHandler = displayLeftTree ? onSelect : undefined;
    // const selectedKeysHandler = displayLeftTree ? selectedKeys : undefined;

    const onSearch = (val, context) => {
        if (!val) {
            setLeftData(existingNodes)
            if (props.graphShownData != {}) {
                initRightTreeData = []
                if (props.graphShownData.nodes) {
                    for (let i = 0; i < props.graphShownData.nodes.length; i++) {
                        const node = props.graphShownData.nodes[i];
                        const label = node.data.label;
                        const newNode = { key: node.data.id, title: node.data.display };

                        const labelData = initRightTreeData.find(group => group.key === label);

                        if (labelData) {
                            labelData.children.push(newNode);
                        } else {
                            initRightTreeData.push({ key: label, title: label, children: [newNode] });
                        }
                    }
                }
                setRightData(initRightTreeData)
            }
            if (context === 'left') {
                setCheckedKeys(checkedKeys)
            }
            return;
        }
        const data = (context === 'left' ? leftData : rightData)
        const newDeptList = data?.map(item => {
            item = Object.assign({}, item)
            if (item.children) {
                item.children = item.children?.filter(res => (res.title.indexOf(val) > -1))
            }
            return item
        }).filter(item => {
            if (item.children?.length > 0 || val.length == 0) {
                item = Object.assign({}, item)
                item.children?.filter(e => (
                    e.title.indexOf(val) > -1 ? '' : item.title.indexOf(val) > -1
                ))
            } else {
                item = item.title.indexOf(val) > -1
            }
            return item
        })
        if (context === 'left') {
            setLeftData(newDeptList)
            setNewList(newDeptList)
        }
        if (context === 'right') {
            setRightData(newDeptList)
        }
    };

    // const items = () => {
    // return (
    //     <div className="legend-container">
    //         <div className="legend-section">
    //             <div className="legend-row">
    //                 {legendData.map((item, index) => (
    //                     <LegendItem key={index} label={item.label} size={item.size} color={item.color} />
    //                 ))}
    //             </div>
    //         </div>
    //     </div>
    //     );
    // };

    // suggested questions
    const [entityItems, setEntityItems] = useState([]);
    const [articleItems, setArticleItems] = useState([]);
    const [entityA1, setEntityA1] = useState({ name: 'Term A', id: null });
    const [entityB1, setEntityB1] = useState({ name: 'Term B', id: null });
    const [entityA2, setEntityA2] = useState({ name: 'Term', id: null });
    const [article, setArticle] = useState({ name: 'Article', id: null });
    const [answer1, setAnswer1] = useState("Select terms from the dropdown menu and click 'Generate Answer' to see the result.");
    const [answer2, setAnswer2] = useState("Select a term from the dropdown menu and click 'Generate Answer' to see the result.");
    const [answer3, setAnswer3] = useState("Select an article and a term from the dropdown menus and click 'Generate Answer' to see the result.");

    const [cypherService] = useState(new CypherService());

    const [loading1, setLoading1] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    // Add loading states for each question type
    const [loadingAssociation, setLoadingAssociation] = useState(false);
    const [loadingSpecificTerm, setLoadingSpecificTerm] = useState(false);
    const [loadingArticleRelation, setLoadingArticleRelation] = useState(false);
    const [loadingCustomQuestion, setLoadingCustomQuestion] = useState(false);

    useEffect(() => {
        if (props.graphShownData && props.graphShownData.nodes) {
            const nodes = props.graphShownData.nodes;

            // Group nodes by their parent/group
            const groupedNodes = {};
            nodes.forEach(node => {
                if (node.data.label !== 'Article' && 
                    node.data.name && 
                    node.data.database_id && 
                    node.data.database_id.length > 0) {
                    
                    const groupKey = node.data.parent || node.data.id;
                    if (!groupedNodes[groupKey]) {
                        // Store only the first node from each group
                        groupedNodes[groupKey] = node;
                    }
                }
            });

            // Create items from the first node of each group
            const items = Object.values(groupedNodes).map((node) => ({
                key: node.data.id,
                label: node.data.name || node.data.id,
                id: node.data.database_id[0] || node.data.id
            }));
            setEntityItems(items);

            if (props.displayArticleGraph) {
                // For articles, group by parent and take first child
                const articleGroups = {};
                const articleNodes = nodes.filter(node => node.data.label === 'Article');
                articleNodes.forEach(node => {
                    const groupKey = node.data.parent || node.data.id;
                    if (!articleGroups[groupKey]) {
                        articleGroups[groupKey] = node;
                    }
                });

                const articleItems = Object.values(articleGroups).map((node) => ({
                    key: node.data.id,
                    label: node.data.display || `PMID ${node.data.pubmed_id}`,
                    id: node.data.database_id[0] || node.data.id
                }));
                setArticleItems(articleItems);
            }
        }
    }, [props.graphShownData, props.displayArticleGraph]);

    const generateAnswer = async (question, terms, article = null) => {
        const params = new URLSearchParams();
        params.append('question', question);
        terms.forEach(term => params.append('term', term));
        if (article) {
            params.append('article', article);
        }
        return await cypherService.generateAnswer(params);
    };

    const updateAnswer1 = async () => {
        setLoadingAssociation(true);
        try {
            const question = `How is ${entityA1.name} associated with ${entityB1.name}?`;
            const answer = await generateAnswer(question, [entityA1.id, entityB1.id]);
            setAnswer1(answer);
        } finally {
            setLoadingAssociation(false);
        }
    };

    const updateAnswer2 = async () => {
        setLoadingSpecificTerm(true);
        try {
            const question = `What is ${entityA2.name}?`;
            const answer = await generateAnswer(question, [entityA2.id]);
            setAnswer2(answer);
        } finally {
            setLoadingSpecificTerm(false);
        }
    };

    const updateAnswer3 = async () => {
        setLoadingArticleRelation(true);
        try {
            const question = `How is article ${article.name} related to ${entityA2.name}?`;
            const answer = await generateAnswer(question, [entityA2.id], article.id);
            setAnswer3(answer);
        } finally {
            setLoadingArticleRelation(false);
        }
    };

    const handleMenuClickA1 = (e) => {
        const selectedEntity = entityItems.find(item => item.key === e.key);
        if (selectedEntity.id !== entityB1.id) {
            setEntityA1({ name: selectedEntity.label, id: selectedEntity.id });
        }
    };

    const handleMenuClickB1 = (e) => {
        const selectedEntity = entityItems.find(item => item.key === e.key);
        if (selectedEntity.id !== entityA1.id) {
            setEntityB1({ name: selectedEntity.label, id: selectedEntity.id });
        }
    };

    const handleMenuClickA2 = (e) => {
        const selectedEntity = entityItems.find(item => item.key === e.key);
        setEntityA2({ name: selectedEntity.label, id: selectedEntity.id });
    };

    const handleMenuClickArticle = (e) => {
        const selectedArticle = articleItems.find(item => item.key === e.key);
        setArticle({ name: selectedArticle.label, id: selectedArticle.id });
    };

    const menuPropsA1 = {
        items: entityItems
            .filter(item => item.id !== entityB1.id)
            .map(item => ({ key: item.key, label: item.label })),
        onClick: handleMenuClickA1,
    };

    const menuPropsB1 = {
        items: entityItems
            .filter(item => item.id !== entityA1.id)
            .map(item => ({ key: item.key, label: item.label })),
        onClick: handleMenuClickB1,
    };

    const menuPropsA2 = {
        items: entityItems.map(item => ({ key: item.key, label: item.label })),
        onClick: handleMenuClickA2,
    };

    const menuPropsArticle = {
        items: articleItems.map(item => ({ key: item.key, label: item.label })),
        onClick: handleMenuClickArticle,
    };

    const renderTreeNode = (node) => {
        return {
            ...node,
            checkable: !node.children,
        };
    };

    const changeLeftPanel = () => {
        if (!props.displayArticleGraph) {
            props.setDisplayArticleGraph(true);
            props.setDetailId(null);
            entityToArticle(props.data);
        } else {
            props.setDisplayArticleGraph(false);
            props.setDetailId(null);
            articleToEntity();
        }
    }

    // New state for user question
    const [userQuestion, setUserQuestion] = useState("");
    const [customAnswer, setCustomAnswer] = useState(""); // State to store the custom question answer

    // Update the handleUserQuestionSubmit function
    const handleUserQuestionSubmit = async () => {
        setLoadingCustomQuestion(true);
        try {
            const questionData = {
                question: userQuestion,
                graph: props.data
            };
            const response = await cypherService.generateFreeAnswer(questionData);
            setCustomAnswer(response.answer);
        } catch (error) {
            console.error('Error submitting question:', error);
            setCustomAnswer('An error occurred while generating the answer.');
        } finally {
            setLoadingCustomQuestion(false);
        }
    };

    // Function to handle templated question submissions
    const handleTemplatedQuestionSubmit = async (questionType) => {
        let answer;
        switch (questionType) {
            case 'association':
                const question1 = `How is ${entityA1.name} associated with ${entityB1.name}?`;
                answer = await generateAnswer(question1, [entityA1.id, entityB1.id]);
                setAnswer1(answer);
                break;
            case 'specificTerm':
                const question2 = `What is ${entityA2.name}?`;
                answer = await generateAnswer(question2, [entityA2.id]);
                setAnswer2(answer);
                break;
            case 'articleRelation':
                const question3 = `How is article ${article.name} related to ${entityA2.name}?`;
                answer = await generateAnswer(question3, [entityA2.id], article.id);
                setAnswer3(answer);
                break;
            default:
                break;
        }
    };

    // No collapse Version
    return (
        <div className="settings-content">
            <Card
                title="Ask the Graph"
                className="settings-card"
                headStyle={{
                    backgroundColor: '#4a7298',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    borderTopLeftRadius: '10px',
                    borderTopRightRadius: '10px',
                }}
            >
                <div className="suggested-questions">
                    <div className="question-section">
                        <h4>Ask a question about the graph:</h4>
                        <div className="question-inputs">
                            <Input
                                placeholder="Type your question here..."
                                value={userQuestion}
                                onChange={(e) => setUserQuestion(e.target.value)}
                            />
                            <Button 
                                onClick={handleUserQuestionSubmit} 
                                loading={loadingCustomQuestion}
                            >
                                Submit Question
                            </Button>
                        </div>
                        {customAnswer && (
                            <div className="answer">
                                <h4>Custom Question Answer:</h4>
                                <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                    {customAnswer}
                                </Typography.Paragraph>
                            </div>
                        )}
                    </div>

                    {props.displayArticleGraph ? (
                        <div className="question-section">
                            <h4>How is an article related to a term?</h4>
                            <div className="question-inputs">
                                <Dropdown menu={menuPropsArticle} trigger={['click']}>
                                    <Button>{article.name} <DownOutlined /></Button>
                                </Dropdown>
                                <Dropdown menu={menuPropsA2} trigger={['click']}>
                                    <Button>{entityA2.name} <DownOutlined /></Button>
                                </Dropdown>
                            </div>
                            <Button 
                                onClick={updateAnswer3} 
                                loading={loadingArticleRelation}
                            >
                                Generate Answer
                            </Button>
                            {answer3 && (
                                <div className="answer">
                                    <h4>Answer:</h4>
                                    <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                        {answer3}
                                    </Typography.Paragraph>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="question-section">
                                <h4>How are two terms associated?</h4>
                                <div className="question-inputs">
                                    <Dropdown menu={menuPropsA1} trigger={['click']}>
                                        <Button>{entityA1.name} <DownOutlined /></Button>
                                    </Dropdown>
                                    <Dropdown menu={menuPropsB1} trigger={['click']}>
                                        <Button>{entityB1.name} <DownOutlined /></Button>
                                    </Dropdown>
                                </div>
                                <Button 
                                    onClick={updateAnswer1} 
                                    loading={loadingAssociation}
                                >
                                    Generate Answer
                                </Button>
                                {answer1 && (
                                    <div className="answer">
                                        <h4>Answer:</h4>
                                        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                            {answer1}
                                        </Typography.Paragraph>
                                    </div>
                                )}
                            </div>

                            <div className="question-section">
                                <h4>What is a specific term?</h4>
                                <div className="question-inputs">
                                    <Dropdown menu={menuPropsA2} trigger={['click']}>
                                        <Button>{entityA2.name} <DownOutlined /></Button>
                                    </Dropdown>
                                </div>
                                <Button 
                                    onClick={updateAnswer2} 
                                    loading={loadingSpecificTerm}
                                >
                                    Generate Answer
                                </Button>
                                {answer2 && (
                                    <div className="answer">
                                        <h4>Answer:</h4>
                                        <Typography.Paragraph ellipsis={{ rows: 3, expandable: true, symbol: 'more' }}>
                                            {answer2}
                                        </Typography.Paragraph>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Filter;