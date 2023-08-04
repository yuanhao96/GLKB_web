import { ConsoleSqlOutlined } from '@ant-design/icons'
import axios from 'axios'

export class DetailService {
    constructor() {}
    async Id2Detail(content) {
        console.log('id to detail')
        let res = []
        var config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        await axios
            .get('/api/1.0/frontend_node_detail/' + content, config)
            .then(function (response) {
                res = response
            })
            .catch(function (error) {
                console.log('error', error)
            })
        return res
    }
}