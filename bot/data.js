var log4js = require('log4js')
const Model = require('../model/index')

async function create_user(sendData) {
  bot_logger().info('start:', `${JSON.stringify(sendData)}`)
  const data = {
    ...sendData,
    ...sendData.chat,
    ...sendData.from,
  }
  try {
    const [userInfo, isCreate] = await Model.BotUser.findOrCreate(data)
    return 
  } catch (error) {

  }
}


module.exports = {
  create_user
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
  var logger = log4js.getLogger('bot')
  return logger
}
