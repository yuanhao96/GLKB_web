import axios from 'axios'

export class CypherService {
    constructor() {}
    async Article2Cypher(content) {
        console.log('article to cypher')
        console.log(content)
        let res = []
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            params: {
                query: content
            }
        }
        await axios
            // .get("/api/1.0/frontend_term2graph", config)
            .get("/1.0/frontend_term2graph", config)
            // .get('/result-page', config)
            .then(function (response) {
                res = response
            })
            .catch(function (error) {
                console.log('error', error)
            })
        return res
    }
}