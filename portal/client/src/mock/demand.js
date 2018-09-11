import Mock from 'mockjs'

let adapters = []
adapters.push(
  (mockAdapter) => mockAdapter.onPost('/api/demand/find').reply(req => {
    let promise = new Promise((resolve, reject) => {
      let data = req.data ? JSON.parse(req.data) : {
        size: 20
      }
      let result = {
        rows: [],
        total: 10000
      }
      // for (let i = 0; i < data.size; i++) {
      //   let item = Mock.mock({
      //     id: Mock.Random.guid(),
      //     name: Mock.Random.cname(),
      //     sex: Mock.Random.integer(1, 2),
      //     'age|18-30': 1,
      //     date: Mock.Random.date(),
      //     address: Mock.mock('@county(true)'),
      //   })
      //   result.rows.push(item)
      // }
      setTimeout(() => {
        resolve([200, result])
      }, 2000)
    })
    return promise
  })
)

adapters.push(
  (mockAdapter) => mockAdapter.onPost('/api/demand/add').reply(req => {
    let promise = new Promise((resolve, reject) => {
      let data = req.data ? JSON.parse(req.data) : {}
      let result = {}
      if (data.skill&data.language&data.industry&data.location&data.bandLow&data.bandHigh&data.quantity&data.startTime&data.endTime) {
        result.success = true
        result.message = '保存成功'
      } else {
        result.success = false
        result.message = '必填参数'
      }

      setTimeout(() => {
        resolve([200, result])
      }, 2000)
    })
    return promise
  })
)

adapters.push(
  (mockAdapter) => mockAdapter.onPost('/api/demand/upd').reply(req => {
    let promise = new Promise((resolve, reject) => {
      let data = req.data ? JSON.parse(req.data) : {}
      let result = {}
      if (data.skill&data.language&data.industry&data.location&data.bandLow&data.bandHigh&data.quantity&data.startTime&data.endTime) {
        result.success = true
        result.message = '修改成功'
      } else {
        result.success = false
        result.message = '必填参数'
      }
      setTimeout(() => {
        resolve([200, result])
      }, 2000)
    })
    return promise
  })
)

adapters.push(
  (mockAdapter) => mockAdapter.onGet(/\/api\/demand\/del\/\w+/).reply(req => {
    let promise = new Promise((resolve, reject) => {
      let result = {
        success: true,
        message: '删除成功'
      }
      setTimeout(() => {
        resolve([200, result])
      }, 2000)
    })
    return promise
  })
)
export {
  adapters
}

