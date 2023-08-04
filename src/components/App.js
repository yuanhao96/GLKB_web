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

Cytoscape.use(cola);
Cytoscape.use(euler);
Cytoscape.use(springy);
export default function App() {
  const [width, setWith] = useState('100%');
  const [height, setHeight] = useState('1000px');

  
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
  
  let graphData = termView
  
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
    name: 'cola',
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
      selector: 'node:selected',
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
      selector: 'edge',
      style: {
        width: 1,
        length: 1,
        // "line-color": "#6774cb",
        'line-color': '#AAD8FF',
        // 'target-arrow-color': '#6774cb',
        // 'target-arrow-shape': 'triangle',
        // 'curve-style': 'bezier',
      },
    },
  ];
  for (var i in id) {
    const index = label.findIndex((pair) => {
      return pair[0] === id[i][1]
    })
    styleSheet.push({
      selector: 'node[id = "' + id[i][0] + '"]',
      style: {
        backgroundColor: 'hsl(' + index*colorDif + ', ' + 100/label[index][1] * id[i][2] + '%, 50%)',
        // backgroundColor: 'hsl(' + index*colorDif + ', 100%, ' + 50/label[index][1] * id[i][2] + '%)',
        width: 10,
        height: 10,
        label: 'data(name)',

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
    // <>
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
    // </>
  );
}
