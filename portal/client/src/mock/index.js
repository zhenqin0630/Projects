import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

let mockAdapter = new MockAdapter(axios)

//会员api
import {
  adapters as demand
} from '@/mock/demand.js'
demand.forEach(item => item(mockAdapter))

export default mockAdapter
