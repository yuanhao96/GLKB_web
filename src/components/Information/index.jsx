import React, { useState, useEffect } from 'react'
import './scoped.css'
import Article from './article'
import Term from './term'
import { DetailService } from '../../service/Detail'
import { Button } from 'antd';
import {
    ConsoleSqlOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined
} from '@ant-design/icons';

const Information = props => {
    const informationClass = props.isOpen ? "information open" : "information";
    const buttonClass = props.isOpen ? "information-button open" : "information-button";

    const [detail, setDetail] = useState({});

    useEffect(() => {
        setDetail({});
        async function searchInfo(content) {
            let detailServ = new DetailService()
            const response = await detailServ.Id2Detail(content)
            setDetail("")
          }
          if (props.detailId) {
            searchInfo(props.detailId);
          }
    }, [props.detailId]);

    // if (!detail) {
    //     return <div>Loading</div>
    // }

//     return (
//         <div>
//             <div className={informationClass}>
//                 {Object.keys(props.detail).length != 0 && props.detailType == "article" && (
//                     <Article
//                         title={props.detail.title}
//                         authors={props.detail.authors}
//                         pmid={props.detail.pmid}
//                         abstract={props.detail.abstract}
//                         abstract_list={props.detail.abstract_list}
//                     />
//                 )}
//                 {Object.keys(props.detail).length != 0 && props.detailType == "term" && (
//                     <Term
//                         entity_id={props.detail.element_id}
//                         name={props.detail.name}
//                         aliases={props.detail.aliases}
//                         description={props.detail.description}
//                         type={props.detail.type}
//                         external_id={props.detail.external_sources}
//                     />
//                 )}
//             </div>
//             <Button
//                 onClick={props.toggleSidebar}
//                 className={buttonClass}
//             >
//                 { !props.isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
//             </Button>
//         </div>
        
//   );
        return (
            <div>
                <div className={informationClass}>
                    {Object.keys(detail).length != 0 && props.detailType == "article" && 'title' in detail && (
                        <Article
                            title={detail.title}
                            authors={detail.authors}
                            pmid={detail.pmid}
                            abstract={detail.abstract}
                            abstract_list={detail.abstract_list}
                        />
                    )}
                    {Object.keys(detail).length != 0 && props.detailType == "term" && 'element_id' in detail && (
                        <Term
                            entity_id={detail.element_id}
                            name={detail.name}
                            aliases={detail.aliases}
                            description={detail.description}
                            type={detail.type}
                            external_id={detail.external_sources}
                        />
                    )}
                </div>
                <Button
                    onClick={props.toggleSidebar}
                    className={buttonClass}
                >
                    { !props.isOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
                </Button>
            </div>
            
      );
};
export default Information;
