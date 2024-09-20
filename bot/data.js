const log4js = require('log4js')
const Model = require('../model/index')
const dataBase = require('../model/database')

async function create_user(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)

  await dataBase.sequelize.transaction(async (t) => {
    try {
      const userInfo = await Model.User.findOne({
        where: {
          user_id: data.user_id
        }
      })
      if (!userInfo) {
        const text = data.text
        const parameter = text.split(' ')[1]; // 假设参数紧跟在/start之后
        if (parameter) {
          data.text = '/start'
          const startParam = parseInt(atob(data.parameter))
          if (!isNaN(startParam)) {
            data.startParam = startParam
            const parentUser = await Model.User.findOne({
              user_id: startParam
            })
            if (parentUser) {
              const config = await Model.Config.findOne({})
              parentUser.increment({
                invite_friends_score: config.invite,
                score: config.invite,
              })
              const event_data = {
                type: 'Inviting',
                from_user: data.user_id,
                to_user: startParam,
                score: config.invite,
                from_username: data.username,
                to_username: parentUser.username,
                desc: `${parentUser.username} invite ${data.username} join us!`
              }
              await Model.Event.create(event_data)
            }
          }
        }
        await Model.User.create(data)
        const event_data = {
          type: 'Register',
          from_user: data.user_id,
          to_user: data.user_id,
          score: 0,
          from_username: data.username,
          to_username: data.username,
          desc: `${data.username}  join us!`
        }
        await Model.Event.create(event_data)
      }
    } catch (error) {
      console.error(error)
    }
  })
}


async function get_userInfo(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let userInfo
  await dataBase.sequelize.transaction(async (t) => {
    try {
      userInfo = await Model.User.findOne({
        where: {
          user_id: data.user_id
        }
      })
      const count = await Model.User.count({
        where: {
          startParam: data.user_id
        }
      })
      userInfo.count = count
    } catch (error) {
      console.error(error)
    }
  })
  return userInfo
}

async function get_tasks(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let list
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const id = data.user_id
      const sql = `SELECT t.*, ut.status FROM tasklist t LEFT JOIN usertask ut ON t.id = ut.task_id AND ut.user_id=${id} ORDER BY t.id`
      list = await dataBase.sequelize.query(sql, { type: dataBase.QueryTypes.SELECT })

    } catch (error) {
      console.error(error)
    }
  })
  return list
}

async function get_tasks(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let list
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const id = data.user_id
      const sql = `SELECT t.*, ut.status FROM tasklist t LEFT JOIN usertask ut ON t.id = ut.task_id AND ut.user_id=${id} ORDER BY t.id`
      list = await dataBase.sequelize.query(sql, { type: dataBase.QueryTypes.SELECT })

    } catch (error) {
      console.error(error)
    }
  })
  return list
}

async function check_tasks(sendData, task_id) {
  const data = handleSendData(sendData)
  operation_log(data)
  let name = ''
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const task_data = {
        task_id: task_id,
        user_id: data.user_id,
        status: 'Claim'
      }
      const [taskItem, created] = await Model.UserTask.findOrCreate({
        where: {
          user_id: data.user_id,
          task_id: task_id
        },
        defaults: task_data
      })
      const taskInfo = await Model.TaskList.findByPk(task_id)
      name = taskInfo.name
    } catch (error) {
      console.error(error)
    }
  })
  return name
}

async function done_tasks(sendData, task_id) {
  const data = handleSendData(sendData)
  operation_log(data)
  let status = ''
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const taskItem = await Model.UserTask.findOne({
        where: {
          user_id: data.user_id,
          task_id: task_id
        },
      })
      if (!taskItem) {
        status = '请先去完成任务'
        return
      }
      if (taskItem.dataValues.status == 'Done') {
        status = '该任务已经完成'
        return
      }
      taskItem.update({
        status: 'Done'
      })
      const taskInfo = await Model.TaskList.findByPk(task_id)

      status = `恭喜获得任务奖励：${taskInfo.score} 积分`
      await Model.User.increment({
        score: taskInfo.score,
        task_score: taskInfo.score
      },
        {
          where: {
            user_id: data.user_id
          }
        })
    } catch (error) {
      console.error(error)
    }
  })
  return status
}

async function get_config() {
  let config
  await dataBase.sequelize.transaction(async (t) => {
    try {
      config = await Model.Config.findOne()
    } catch (error) {
      console.error(error)
    }
  })
  return config
}

async function set_language(id, lang) {
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const userInfo = await Model.User.findOne({
        where: {
          user_id: id
        }
      })
      if (!userInfo) {

      } else {
        await userInfo.update({
          lang: lang
        })
      }
    } catch (error) {
      console.error(error)
    }
  })
}

async function get_language(id) {
  let lang = 'en'
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const userInfo = await Model.User.findOne({
        where: {
          user_id: id
        }
      })
      if (userInfo) {
        lang = userInfo.dataValues.lang
      } else {

      }
    } catch (error) {
      console.error(error)
      return lang
    }
  })
  return lang
}

async function operation_log(data) {
  bot_logger().info('operation_log:', `${JSON.stringify(data)}`)

  await dataBase.sequelize.transaction(async (t) => {
    try {
      const event_data = {
        ...data,
        desc: `${data.username} input ${data.text}`
      }
      await Model.BotEvent.create(event_data)
    } catch (error) {
      bot_logger().error(`operation_log Error: ${error}`)
    }
  })
}

module.exports = {
  create_user,
  set_language,
  get_language,
  get_userInfo,
  get_config,
  get_tasks,
  check_tasks,
  done_tasks,
}


function handleSendData(sendData) {
  const data = {
    ...sendData,
    ...sendData.chat,
    ...sendData.from,
  }
  delete data.from
  delete data.chat
  delete data.entities
  data.user_id = data.id
  delete data.id

  return data
}




function bot_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/bot/bot',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  const logger = log4js.getLogger('bot')
  return logger
}
