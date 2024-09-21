const log4js = require('log4js')
const Model = require('../model/index')
const dataBase = require('../model/database')
const { isLastDay } = require('../utils/common')
const moment = require('moment/moment')

//-- demo--//
async function demo(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  await dataBase.sequelize.transaction(async (t) => {
    try {

    } catch (error) {
      console.error(error)
      bot_logger().error(`demo Error: ${error}`)
    }
  })
}

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
      bot_logger().error(`create_user Error: ${error}`)
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
      bot_logger().error(`get_userInfo Error: ${error}`)
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
      bot_logger().error(`get_tasks Error: ${error}`)
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
      bot_logger().error(`check_tasks Error: ${error}`)
    }
  })
  return name
}


async function user_feedBack(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let score = 0
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const config = await Model.Config.findOne()
      const feedData = {
        user_id: data.user_id,
        text: data.text,
        score: config.feed_back
      }
      score = config.feed_back
      await Model.FeedBack.create(feedData)
      await dataBase.cache.set(`${data.user_id}feedBack`, 0)

    } catch (error) {
      console.error(error)
      bot_logger().error(`user_feedBack Error: ${error}`)
    }
  })
  return score
}

async function get_scripts(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let scripts = []
  await dataBase.sequelize.transaction(async (t) => {
    try {
      scripts = await Model.Script.findAll()

    } catch (error) {
      console.error(error)
      bot_logger().error(`demo Error: ${error}`)
    }
  })
  return scripts
}

async function get_script_detail(sendData, id) {
  const data = handleSendData(sendData)
  operation_log(data)
  let scripts;
  await dataBase.sequelize.transaction(async (t) => {
    try {
      scripts = await Model.Script.findByPk(id)
      scripts.config = await Model.Config.findOne()
    } catch (error) {
      console.error(error)
      bot_logger().error(`demo Error: ${error}`)
    }
  })
  return scripts
}

async function get_script_option(sendData, id) {
  const data = handleSendData(sendData)
  operation_log(data)
  let options;
  await dataBase.sequelize.transaction(async (t) => {
    try {
      // 扣分
      const isBegin = await Model.UserChoose.findOne({
        where: {
          user_id: data.user_id,
          script_id: id
        }
      })

      if (!isBegin) {
        const config = await Model.Config.findOne()
        const userInfo = await Model.User.findOne({
          where: {
            user_id: data.user_id
          }
        })
        if (userInfo.dataValues.score < config.choose_jb) {
          options = false
          return
        }
        await userInfo.decrement({
          score: config.choose_jb
        })
        await Model.UserChoose.create({
          user_id: data.user_id,
          script_id: id
        })
        const event_data = {
          from_user: data.user_id,
          to_user: data.user_id,
          from_username: data.username,
          to_username: data.username,
          score: 0 - config.choose_jb,
          type: 'choose_script',
          desc: `${data.username} choose a script`
        }
        await Model.Event.create(event_data)
      }
      const scriptDetail = await Model.ScriptDetail.findOne({
        order: [['sort', 'asc']],
        where: {
          script_id: id
        }
      })
      options = scriptDetail.dataValues
      const list = await Model.ChooseOption.findAll({
        order: [['sort', 'asc']],
        where: {
          ScriptDetail_id: scriptDetail.dataValues.id
        }
      })
      options.list = []
      list.forEach(element => {
        options.list.push(element.dataValues)
      });
    } catch (error) {
      console.error(error)
      bot_logger().error(`demo Error: ${error}`)
    }
  })
  return options
}

async function choose_option(sendData, id) {
  const data = handleSendData(sendData, id)
  operation_log(data)
  let result = {
    code: 0
  }
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const optionDetail = await Model.ChooseOption.findByPk(id)

      const [userChooseDetail, isCreate] = await Model.UserChoose.findOrCreate({
        where: {
          user_id: data.user_id,
          script_id: optionDetail.script_id,
          detail_id: optionDetail.scriptDetail_id,
        },
        defaults: {
          user_id: data.user_id,
          script_id: optionDetail.script_id,
          detail_id: optionDetail.scriptDetail_id,
          option_id: id
        }
      })

      if (!isCreate) {
        result.code = 400
        result.msg = '该情节已选择!'
      }
      const config = await Model.Config.findOne()
      const userInfo = await Model.User.findOne({
        where: {
          user_id: data.user_id
        }
      })
      if (result.code == 0) {
        await userInfo.increment({
          score: config.click_jb,
        })
        const event_data = {
          from_user: data.user_id,
          to_user: data.user_id,
          from_username: data.username,
          to_username: data.username,
          score: config.click_jb,
          type: 'choose_option',
          desc: `${data.username} choose a option`
        }
        await Model.Event.create(event_data)
      }


      const _chooseDetail = await Model.ChooseOption.findByPk(id)
      // current scriptDetail
      let scriptDetail = await Model.ScriptDetail.findByPk(_chooseDetail.scriptDetail_id)
      // next scriptDetail
      scriptDetail = await Model.ScriptDetail.findOne({
        where: {
          script_id: _chooseDetail.script_id,
          sort: scriptDetail.dataValues.sort + 1
        }
      })

      if (!scriptDetail) {
        let add_score = config.done_jb
        if (result.code == 0) {
          if (userInfo.dataValues.complete == 0) {
            add_score += config.done_first_jb
            const event_data = {
              from_user: data.user_id,
              to_user: data.user_id,
              from_username: data.username,
              to_username: data.username,
              score: config.done_first_jb,
              type: 'done_script_first',
              desc: `${data.username} done a first script`
            }
            await Model.Event.create(event_data)
          }
          await userInfo.increment({
            score: add_score
          })
          const event_data = {
            from_user: data.user_id,
            to_user: data.user_id,
            from_username: data.username,
            to_username: data.username,
            score: config.done_jb,
            type: 'done_script',
            desc: `${data.username} done a script`
          }
          await Model.Event.create(event_data)
        }
        result.code = 401
        result.msg = '该剧本已经完成'
      } else {
        result.data = scriptDetail.dataValues
        const list = await Model.ChooseOption.findAll({
          order: [['sort', 'asc']],
          where: {
            ScriptDetail_id: scriptDetail.dataValues.id
          }
        })
        result.data.list = []
        list.forEach(element => {
          result.data.list.push(element.dataValues)
        });
      }
    } catch (error) {
      console.error(error)
      bot_logger().error(`demo Error: ${error}`)
    }
  })
  return result
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
      bot_logger().error(`done_tasks Error: ${error}`)
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
      bot_logger().error(`get_config Error: ${error}`)
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
      bot_logger().error(`set_language Error: ${error}`)
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
      bot_logger().error(`get_language Error: ${error}`)
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

async function user_checkIn(sendData) {
  const data = handleSendData(sendData)
  operation_log(data)
  let signObj = {}
  await dataBase.sequelize.transaction(async (t) => {
    try {
      const user = await Model.User.findOne({
        where: {
          user_id: data.user_id
        }
      })
      let day = 1
      let today = moment().utc().format('MM-DD')
      const checkInList = await Model.Event.findAll({
        where: {
          type: 'checkIn',
          from_user: data.user_id,
        },
        order: [['createdAt', 'desc']],
        attributes: ['createdAt']
      })
      const newCheckInList = checkInList.filter(item => {
        return moment(item.dataValues.createdAt).utc().format('MM-DD') != today
      })

      newCheckInList.map((item, index) => {
        if (isLastDay(new Date(item.dataValues.createdAt).getTime(), index + 1)) {
          day = (index + 2) % 7 + 1
        }
      })

      const allRewardList = await Model.CheckInReward.findAll({
        order: [['day', 'asc']],
        attributes: ['day', 'score', 'ticket']
      })
      const rewardList = allRewardList.filter((item) => {
        return item.dataValues.day == day
      })
      const reward = rewardList[0]
      let check_score = user.check_score
      let score = user.score
      let ticket = user.ticket
      if (user.check_date != today) {
        check_score += reward.score
        score += reward.score
        ticket += reward.ticket
        await Model.User.update({
          check_date: today,
          check_score: check_score,
          score: score,
          ticket: ticket
        }, {
          where: {
            user_id: data.user_id
          },
        })

        let event_data = {
          type: 'checkIn',
          from_user: data.user_id,
          from_username: user.username,
          to_user: data.user_id,
          to_username: user.username,
          desc: `${user.username} is checked day: ${day}`,
          score: reward.score,
          ticket: reward.ticket,
        }
        await Model.Event.create(event_data)
        if (user.startParam) {
          const parentUser = await Model.User.findOne({
            where: {
              user_id: user.startParam
            }
          })
          if (parentUser) {
            const config = await Model.Config.findOne()
            const score_ratio = Math.floor(reward.score * config.invite_friends_ratio / 100)
            await parentUser.increment({
              score: score_ratio,
              invite_friends_score: score_ratio
            })
            event_data = {
              type: 'checkIn_parent',
              from_user: data.user_id,
              from_username: user.username,
              to_user: parentUser.user_id,
              to_username: parentUser.username,
              score: score_ratio,
              ticket: 0,
              desc: `${parentUser.username} get checkIn reward ${score_ratio} $CAT from ${user.username}`
            }
            await Model.Event.create(event_data)
          }
        }
      }
      signObj = {
        check_date: today,
        score: reward.score,
        day: day,
      }
    } catch (error) {
      console.error(error)
      bot_logger().error(`user_checkIn Error: ${error}`)
    }
  })
  return signObj
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
  user_feedBack,
  user_checkIn,
  get_scripts,
  get_script_detail,
  get_script_option,
  choose_option,
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
