const log4js = require('log4js')
const Model = require('../model/index')
const dataBase = require('../model/database')

async function create_user(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)

  await dataBase.sequelize.transaction(async (t) => {
    try {
      const userInfo = await Model.BotUser.findOne({
        where: {
          user_id: data.user_id
        }
      })
      if (!userInfo) {
        await Model.BotUser.create(data)
      }
    } catch (error) {
      console.error(error)
    }
  })
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
  create_user
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
