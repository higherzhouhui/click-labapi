const { bot, bot_logger } = require('./index')
const imageUrl = 'https://img0.baidu.com/it/u=739050917,3625217136&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
const operation = require('./data')
const { getMessage } = require('./utils')
// 处理按钮点击事件
bot.on('callback_query', async (callbackQuery) => {
  bot_logger().info('callback_query', `${JSON.stringify(callbackQuery)}`)
  try {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const message_id = callbackQuery.message.message_id
    const queryId = callbackQuery.id;

    // 根据点击的按钮发送不同的消息
    if (data.includes('lang-')) {
      let _lang = data.replace('lang-', '')
      await operation.set_language(chatId, _lang)
      const caption = await getMessage(chatId, 'lang_caption')
      const replyMarkup = {
        caption: caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "所有剧本",
                callback_data: "all-juBen"
              },
            ],
            [
              {
                text: "任务",
                callback_data: "all-task"
              }
            ],
            [
              {
                text: "个人信息",
                callback_data: "userInfo"
              },
            ],
            [
              {
                text: "签到",
                callback_data: "checkIn"
              },
            ],
            [
              {
                text: "反馈",
                callback_data: "fallBack"
              },
            ],
          ]
        }
      };
      bot.sendPhoto(chatId, imageUrl, replyMarkup);
    } else if (data == 'all-juBen') {

    } else if (data == 'all-task') {
      const list = await operation.get_tasks(callbackQuery)
      const logo = 'https://img2.baidu.com/it/u=3453496786,1847995088&fm=253&fmt=auto?w=1423&h=800'
      let inline_keyboard = []
      list.forEach(item => {
        inline_keyboard.push([
          {
            text: `${item.name}`,
            url: item.link,
          },
        ])
        inline_keyboard.push([
          {
            text: '检查',
            callback_data: `check-${item.id}`
          },
          {
            text: '领取',
            callback_data: `claim-${item.id}`
          }
        ])
      })
      const replyMarkup = {
        reply_markup: {
          inline_keyboard
        }
      }
      bot.sendPhoto(chatId, logo, replyMarkup);

    } else if (data == 'userInfo') {
      const userInfo = await operation.get_userInfo(callbackQuery)
      const avatar = 'https://img0.baidu.com/it/u=3348785934,3249339235&fm=253&fmt=auto&app=138&f=PNG?w=100&h=100'
      const config = await operation.get_config()
      const replyMarkup = {
        caption: `我的积分: ${userInfo.score}\n邀请好友: ${userInfo.count}\n邀请得分: ${userInfo.invite_friends_score || 0}\n邀请链接: ${config.bot_url}?start=${btoa(chatId)}`,
        // reply_markup: {
        //   inline_keyboard: [
        //     [
        //       {
        //         text: "邀请好友",
        //         callback_data: 'copy_invite_url'
        //       },
        //     ],
        //   ]
        // }
      };
      bot.sendPhoto(chatId, avatar, replyMarkup);
    } else if (data.includes('check-')) {
      const task_id = data.replace('check-', '')
      const name = await operation.check_tasks(callbackQuery, task_id)
      const logo = 'https://img2.baidu.com/it/u=2093533853,2293668299&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
      const replyMarkup = {
        caption: `${name} 任务完成，快去领取奖励吧！`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "领取",
                callback_data: `claim-${task_id}`
              },
            ],
          ]
        }
      };
      bot.sendPhoto(chatId, logo, replyMarkup)
    } else if (data.includes('claim-')) {
      const task_id = data.replace('claim-', '')
      const message = await operation.done_tasks(callbackQuery, task_id)
      bot.sendMessage(chatId, message)
    } else if (data == 'fallBack') {
      bot.sendMessage(chatId, '请输入反馈内容：')
    } else if (data == 'checkIn') {
      
    }
    bot.answerCallbackQuery(queryId)
  } catch (error) {
    bot_logger().error('callback_query', `${error}`)
  }
});