// import React, {Fragment, useEffect, useRef} from 'react';
// import cytoscape from 'cytoscape'
// import testdata from './data.json'
// import CytoscapeComponent from "react-cytoscapejs";

// const GraphTest = () => {
//   console.log(testdata)
//   const graphRef = useRef(null)
//   const drawGraph = () => {
//     const cy = cytoscape({
//       container: graphRef.current,
//       elements: {
//         nodes: testdata.nodes,
//         edges: testdata.edges
//       },
//       stylesheet: {
//         selector: 'node',
//         style: {
//           'background-color': 'red'
//         }
//       }
//     })
//   }
//   const cystyle = {
//     selector: 'node',
//     style: {
//       'background-color': 'red'
//     }
//   }
  

//   useEffect(() => {
//     drawGraph()
//   }, [])

//  return (
//   <Fragment>
//    <h2>Graph Test</h2>
//    <div ref={graphRef} style={{width: '100%', height: '80vh'}}>
//    <CytoscapeComponent 
//     elements={CytoscapeComponent.normalizeElements(testdata)}
//    />
//    </div>
//   </Fragment>
//  )
// }

// export default GraphTest
import React, { useState } from 'react';
import testdata from './article_semantic_graph.json'
import CytoscapeComponent from 'react-cytoscapejs';
import Cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import euler from 'cytoscape-euler';
import springy from 'cytoscape-springy'
import d3Force from 'cytoscape-d3-force';

Cytoscape.use(cola);
Cytoscape.use(euler);
Cytoscape.use(d3Force);
Cytoscape.use(springy);
export default function App() {
  const [width, setWith] = useState('100%');
  const [height, setHeight] = useState('1000px');

  // console.log(11111111)
  let articleView={"edges":[], "nodes":[]}
  let termView={"edges":[], "nodes":[]}
  let articleTermView={"edges":[], "nodes":[]}
  for (var i in testdata.nodes) {
    if (testdata.nodes[i].data.label === "Article") {
      articleView.nodes.push(testdata.nodes[i])
    }
    if (testdata.nodes[i].data.label !== "Article" && testdata.nodes[i].data.label !== "Event" ) {
      termView.nodes.push(testdata.nodes[i])
    }
    if (testdata.nodes[i].data.label !== "Event" ) {
      articleTermView.nodes.push(testdata.nodes[i])
    }
  }
  for (var i in testdata.edges) {
    // console.log(termView.nodes.includes(testdata.nodes.find((node) => node.data.id === testdata.edges[i].data.source)))
    if (testdata.edges[i].data.label === "Cite") {
      articleView.edges.push(testdata.edges[i])
    }
    if (testdata.edges[i].data.label !== "Cite" && testdata.edges[i].data.label !== "Contain_vocab" ) {
      if (termView.nodes.includes(testdata.nodes.find((node) => node.data.id === testdata.edges[i].data.source)) && termView.nodes.includes(testdata.nodes.find((node) => node.data.id === testdata.edges[i].data.target))) {
        termView.edges.push(testdata.edges[i])
      }
    }
    if (testdata.edges[i].data.label === "Contain_vocab") {
      articleTermView.edges.push(testdata.edges[i])
    }
  }
  // console.log(articleView)
  
  let graphData = testdata
  
  let label = []
  let id = []
  for (var i in graphData.nodes) {
    if (label.find(pair => pair.includes(graphData.nodes[i].data.label)) == undefined) {
      label.push([graphData.nodes[i].data.label, graphData.nodes[i].data.frequency])
    }
    if (label.find(pair => pair.includes(graphData.nodes[i].data.label))[1] < graphData.nodes[i].data.frequency) {
      label.find(pair => pair.includes(graphData.nodes[i].data.label))[1] = graphData.nodes[i].data.frequency
    }
    id.push([graphData.nodes[i].data.id, graphData.nodes[i].data.label, graphData.nodes[i].data.frequency])
  }
  // console.log(label)
  const colorDif = 360 / label.length
  // console.log(eventStyle)

  // console.log(graphData);

  const layout = {
    name: 'circle',
    bundleEdges: true
    // fit: true,
    // circle: true,
    // directed: true,
    // padding: 50,
    // // spacingFactor: 1.5,
    // animate: true,
    // animationDuration: 1000,
    // avoidOverlap: true,
    // nodeDimensionsIncludeLabels: false,
  };

  const styleSheet = [
    // {
    //   selector: 'node[label = "Event"]',
    //   style: {
    //     backgroundColor: 'hsl(0, 100%, 50%)',
    //     width: 10,
    //     height: 10,
    //     label: 'data(name)',

    //     // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
    //     // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
    //     // "text-valign": "center",
    //     // "text-halign": "center",
    //     'overlay-padding': '8px',
    //     'z-index': '10',
    //     //text props
    //     'text-outline-color': '#4a56a6',
    //     'text-outline-width': '2px',
    //     color: 'white',
    //     fontSize: 10,
    //   },
    // },
    {
      selector: 'node.hover',
      style: {
        'border-width': '6px',
        'border-color': '#AAD8FF',
        'border-opacity': '0.5',
        'background-color': '#77828C',
        width: 50,
        height: 50,
        //text props
        'text-outline-color': '#77828C',
        'text-outline-width': 8,
      },
    },
    {
      selector: "node[type='device']",
      style: {
        shape: 'rectangle',
      },
    },
    {
      selector: 'edge[label="Contain_vocab"]',
      style: {
        // "curve-style": "unbundled-bezier",
    // "control-point-distances": 120,
    // "control-point-weights": 0.2,
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#FF7F50',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge[label="co_occur"]',
      style: {
        // "curve-style": "unbundled-bezier",
    // "control-point-distances": 120,
    // "control-point-weights": 0.2,
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#008080',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge[label="Semantic_relationship"]',
      style: {
        // "curve-style": "unbundled-bezier",
    // "control-point-distances": 120,
    // "control-point-weights": 0.2,
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#008080',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge[label="Hierarchical_structure"]',
      style: {
        // "curve-style": "unbundled-bezier",
    // "control-point-distances": 120,
    // "control-point-weights": 0.2,
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#E0B0FF',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge[label="cite"]',
      style: {
        // "curve-style": "unbundled-bezier",
    // "control-point-distances": 120,
    // "control-point-weights": 0.2,
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#E0B0FF',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
    {
      selector: 'node.highlight',
      style: {
          'border-color': '#FFF',
          'border-width': '2px'
      }
    },
    {
        selector: 'node.semitransp',
        style:{ 'opacity': '0.5' }
    },
    {
        selector: 'edge.highlight',
        style: { 'mid-target-arrow-color': '#FFF' }
    },
    {
        selector: 'edge.semitransp',
        style:{ 'opacity': '0.2' }
    }
  ];
  for (var i in id) {
    const index = label.findIndex((pair) => {
      return pair[0] === id[i][1]
    })
    styleSheet.push({
      selector: 'node[id = "' + id[i][0] + '"]',
      style: {
        backgroundColor: 'hsl(' + index*colorDif + ', ' + 90/label[index][1] * id[i][2] + '%, 50%)', 
        backgroundOpacity: 0.3, 
        // backgroundColor: 'hsl(' + index*colorDif + ', 100%, ' + 50/label[index][1] * id[i][2] + '%)',
        // width: 10,
        // height: 10,
        label: 'data(display)',

        // "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        // "text-valign": "center",
        // "text-halign": "center",
        'overlay-padding': '8px',
        'z-index': '10',
        //text props
        'text-outline-color': '#4a56a6',
        'text-outline-width': '2px',
        color: 'white',
        fontSize: 10,
      },
    })
  }
  // console.log(styleSheet)

  let myCyRef;
  
  return (
    <>
      <div>
        <h1>Cytoscape example</h1>
        <div
        >
          <CytoscapeComponent
            elements={CytoscapeComponent.normalizeElements(graphData)}
            // pan={{ x: 200, y: 200 }}
            style={{ width: width, height: height }}
            zoomingEnabled={true}
            maxZoom={2}
            minZoom={0.5}
            autounselectify={false}
            boxSelectionEnabled={true}
            layout={layout}
            stylesheet={styleSheet}
            cy={(cy) => {
              myCyRef = cy;
    //         cy.nodes('[label = "Event"]').style({'background-color': 'white',
    // 'color': 'black'});
              console.log('EVT', cy);
              // cy.on('mouseover', 'node', function(e){
              //     var sel = e.target;
              //     cy.elements().difference(sel.incomers()).not(sel).addClass('semitransp');
              //     sel.addClass('highlight').incomers().addClass('highlight');
              // });
              var highlight = null
              cy.on('tap', function(e){
                var sel = e.target;
                if (sel === cy) {
                  if (highlight != null) {
                    cy.elements().removeClass('semitransp');
                    highlight.removeClass('highlight').outgoers().removeClass('highlight');
                    highlight = null
                  }
                }
                if (sel.isNode) {
                  if (highlight != null) {
                    cy.elements().removeClass('semitransp');
                    highlight.removeClass('highlight').outgoers().removeClass('highlight');
                  }
                  // Highlight the selected node and its outgoing edges
                  highlight = sel
                  sel.addClass('highlight');
                  sel.outgoers().addClass('highlight');

                  // Highlight the incoming edges
                  sel.incomers().addClass('highlight');

                  // Reduce opacity of non-highlighted elements
                  cy.elements().difference(sel.connectedEdges()).not(sel).addClass('semitransp');
                }
              });
              cy.on('mouseover', 'node', function(e){
                  var sel = e.target;
                  sel.addClass('hover');
              });
              cy.on('mouseout', 'node', function(e){
                  var sel = e.target;
                  sel.removeClass('hover');
              });
              cy.on('tap', 'node', (evt) => {
                var node = evt.target;
                console.log('EVT', evt);
                console.log('TARGET', node.data());
                console.log('TARGET TYPE', typeof node[0]);
              });
            }}
            abc={console.log('myCyRef', myCyRef)}
          />
        </div>
      </div>
    </>
  );
}
