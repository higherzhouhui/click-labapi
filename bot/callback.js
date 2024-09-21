const { bot, bot_logger } = require('./index')
const imageUrl = 'https://img0.baidu.com/it/u=739050917,3625217136&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';
const operation = require('./data')
const { getMessage } = require('./utils');
const { cache } = require('../model/database');
// 处理按钮点击事件
bot.on('callback_query', async (callbackQuery) => {
  bot_logger().info('callback_query', `${JSON.stringify(callbackQuery)}`)
  try {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message.chat.id;
    const message_id = callbackQuery.message.message_id
    const queryId = callbackQuery.id;

    // 根据点击的按钮发送不同的消息
    if (data.includes('lang-') || data == 'menu') {
      let caption
      if (data == 'menu') {
        caption = ''
      } else {
        let _lang = data.replace('lang-', '')
        await operation.set_language(chatId, _lang)
        caption = await getMessage(chatId, 'lang_caption')
      }
      const replyMarkup = {
        caption: caption,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "剧本",
                callback_data: "scripts"
              },
            ],
            [
              {
                text: "任务",
                callback_data: "tasks"
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
                callback_data: "feedBack"
              },
            ],
          ]
        }
      };
      bot.sendPhoto(chatId, imageUrl, replyMarkup);
    } else if (data == 'all-juBen') {

    } else if (data == 'tasks') {
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
      inline_keyboard.push([
        {
          text: "返回",
          callback_data: `menu`
        },
      ])
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
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "返回",
                callback_data: 'menu'
              },
            ],
          ]
        }
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
    } else if (data == 'feedBack') {
      bot.sendMessage(chatId, '请输入反馈内容：')
      cache.set(`${chatId}feedBack`, 1)
    } else if (data == 'checkIn') {
      const singObj = await operation.user_checkIn(callbackQuery)
      if (singObj) {
        const logo = 'https://img0.baidu.com/it/u=3343907092,2842815082&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=889'
        const replyMarkup = {
          caption: `签到成功，获得${singObj.score}积分,第${singObj.day}天\n连续签到7天更有大礼！\n中断签到重新计算天数\n每天00:00(UTC+0)可签到`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "返回",
                  callback_data: `menu`
                },
              ],
            ]
          }
        };
        bot.sendPhoto(chatId, logo, replyMarkup)
      } else {
        bot.sendMessage(chatId, '网络异常，请稍后重试')
      }
    } else if (data == 'scripts') {
      const imageUrl = 'https://img2.baidu.com/it/u=2429226539,3429519924&fm=253&fmt=auto&app=120&f=JPEG?w=829&h=500';
      const list = await operation.get_scripts(callbackQuery)
      const inline_keyboard = []
      list.forEach(item => {
        inline_keyboard.push([
          {
            text: item.name,
            callback_data: `scripts-${item.id}`
          }
        ])
      })
      inline_keyboard.push([
        {
          text: '返回',
          callback_data: 'menu'
        }
      ])
      // 构建带有图片和按钮的消息
      const replyMarkup = {
        caption: '文本1\n文本2',
        reply_markup: {
          inline_keyboard: inline_keyboard
        }
      };
      bot.sendPhoto(chatId, imageUrl, replyMarkup);
    } else if (data.includes('scripts-')) {
      const script_id = data.replace('scripts-', '')
      const detail = await operation.get_script_detail(callbackQuery, script_id)
      
      const logo = detail.logo
      const replyMarkup = {
        caption: `${detail.bg}\n${detail.intro}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: `开始  -${detail.config.choose_jb}`,
                callback_data: `beginScript-${script_id}`
              },
              {
                text: "返回",
                callback_data: `scripts`
              },
            ],
          ]
        }
      };
      bot.sendPhoto(chatId, logo, replyMarkup)
    } else if (data.includes('beginScript-')) {
      const script_id = data.replace('beginScript-', '')
      const result = await operation.get_script_option(callbackQuery, script_id)
      if (result) {
        const imageUrl = result.pic
        const list = result.list
        const inline_keyboard = []
        list.forEach(item => {
          inline_keyboard.push([
            {
              text: item.label,
              callback_data: `option-${item.id}`
            }
          ])
        })
        inline_keyboard.push([
          {
            text: '返回',
            callback_data: `scripts-${script_id}`
          }
        ])
        // 构建带有图片和按钮的消息
        const replyMarkup = {
          caption: result.text,
          reply_markup: {
            inline_keyboard: inline_keyboard
          }
        };
        const botMsg = await bot.sendPhoto(chatId, imageUrl, replyMarkup);
        cache.set(`sendChoose${chatId}`, botMsg.message_id)
      } else {
        bot.sendMessage(chatId, '积分不足，快去邀请好友或者完成任务获取积分吧！')
      }
    } else if (data.includes('option-')) {
      const option_id = data.replace('option-', '')
      try {
        const last_option = await cache.get(`sendChoose${chatId}`)
        bot.deleteMessage(chatId, last_option)
      } catch (error) {
        console.error(error)
        bot_logger().error(`deleteMessage-${chatId}`, `${error}`)
      }
      const result = await operation.choose_option(callbackQuery, option_id)
      if (result.code == 0 || result.code == 400) {
        const imageUrl = result.data.pic
        const list = result.data.list
        const inline_keyboard = []
        list.forEach(item => {
          inline_keyboard.push([
            {
              text: item.label,
              callback_data: `option-${item.id}`
            }
          ])
        })
        inline_keyboard.push([
          {
            text: '返回',
            callback_data: `scripts-${result.data.script_id}`
          }
        ])
        // 构建带有图片和按钮的消息
        const replyMarkup = {
          caption: result.data.text,
          reply_markup: {
            inline_keyboard: inline_keyboard
          }
        };
        if (result.msg) {
          bot.sendMessage(chatId, result.msg)
        }
        const botMsg = await bot.sendPhoto(chatId, imageUrl, replyMarkup);
        cache.set(`sendChoose${chatId}`, botMsg.message_id)
      } else if (result.code == 401) {
        const imageUrl = 'https://img1.baidu.com/it/u=2483272398,915121754&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
        const replyMarkup = {
          caption: `恭喜你完成了该剧情！`,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "返回",
                  callback_data: `scripts`
                },
              ],
            ]
          }
        };
        bot.sendPhoto(chatId, imageUrl, replyMarkup)
      }
    }
    bot.answerCallbackQuery(queryId)
  } catch (error) {
    bot_logger().error('callback_query', `${error}`)
    console.error(error)
  }
});
