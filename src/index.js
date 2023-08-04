import React from 'react'
import ReactDOM from 'react-dom'
import HomePage from './components/HomePage'
import { Provider } from 'react-globally'
import { createBrowserHistory } from 'history';

import ResultPage from './components/ResultPage'
import { Result } from 'antd'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// const browserHistory = createBrowserHistory();
const initState = {
    searchType: ''
}

ReactDOM.render(
    // <React.StrictMode>
    //     <Provider globalState={initState}>
    //             {/* <App /> */}
    //             {/* <HomePage /> */}
    //             {/* <ResultPage /> */}
    //             {/* <ArticlePage /> */}
    //             {/* <EntityPage /> */}
                <Router>
                    <Routes>
                        <Route path='/result' element={<ResultPage />} />
                        <Route eaxt path="/" element={<HomePage />} />
                    </Routes>
                </Router>,
    //     </Provider>
    // </React.StrictMode>
    // <HomePage />,
    // <ResultPage />,
    document.getElementById('root')
)