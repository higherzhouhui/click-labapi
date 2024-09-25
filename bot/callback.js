const { bot, bot_logger } = require('./index')
const operation = require('./data')
const { getMessage, getLocalSource } = require('./utils');
const { cache } = require('../model/database');
const optionList = ['A', 'B', 'C', 'D']
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
      // let caption
      // if (data == 'menu') {
      //   caption = ''
      // } else {
      //   let _lang = data.replace('lang-', '')
      //   await operation.set_language(chatId, _lang)
      //   caption = await getMessage(chatId, 'lang_caption')
      // }
      // const source = getLocalSource('./public/gif/introduce.gif')
      const source = 'https://my-blog-seven-omega.vercel.app/static/gif/introduce.gif'
      const replyMarkup = {
        caption: '',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Story",
                callback_data: "story"
              },
            ],
            [
              {
                text: "Task",
                callback_data: "tasks"
              }
            ],
            [
              {
                text: "User",
                callback_data: "userInfo"
              },
            ],
            [
              {
                text: "CheckIn",
                callback_data: "checkIn"
              },
            ],
            [
              {
                text: "FAQ",
                callback_data: "feedBack"
              },
            ],
          ]
        }
      };
      bot.sendVideo(chatId, source, replyMarkup, { contentType: 'application/octet-stream', filename: 'menu' });
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
            text: 'Check',
            callback_data: `check-${item.id}`
          },
          {
            text: 'Claim',
            callback_data: `claim-${item.id}`
          }
        ])
      })
      inline_keyboard.push([
        {
          text: "Return",
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
      const config = await operation.get_config()
      const replyMarkup = {
        caption: `${userInfo.username}\n\nScore: ${userInfo.score} Pts\nStory Limit: ${userInfo.ticket}\nComplete Story Times: ${userInfo.complete}\nFriends: ${userInfo.count}\nInvite Link: ${config.bot_url}?start=${btoa(chatId)}`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Return",
                callback_data: 'menu'
              },
            ],
          ]
        }
      };
      bot.sendMessage(chatId, replyMarkup.caption, replyMarkup);
    } else if (data.includes('check-')) {
      const task_id = data.replace('check-', '')
      const name = await operation.check_tasks(callbackQuery, task_id)
      const logo = 'https://img2.baidu.com/it/u=2093533853,2293668299&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
      const replyMarkup = {
        caption: `${name} Task completed, go and claim the reward!`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Claim",
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
      bot.sendMessage(chatId, 'OK. Send me a FAQ and content. Please use this format:\n\nFAQ - content')
    } else if (data == 'checkIn') {
      const singObj = await operation.user_checkIn(callbackQuery)
      if (singObj) {
        const caption = `CheckIn successful\n\n+${singObj.ticket} limit ${singObj.score > 0  ? `+${signObj.score} Pts` : ''}   Day: ${singObj.day}\n\nCheckIn for 7 consecutive days and receive a great gift!\nInterrupt check-in and recalculate days\nCheck in available at 00:00 (UTC+0) every day`
        const replyMarkup = {
          caption: caption,
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Return",
                  callback_data: `menu`
                },
              ],
            ]
          }
        };
        bot.sendMessage(chatId, caption, replyMarkup)
      } else {
        bot.sendMessage(chatId, 'please exec start command')
      }
    } else if (data == 'story') {
      // const source = getLocalSource('./public/pic/redroom.png');
      const source = 'https://my-blog-seven-omega.vercel.app/static/pic/redroom.png'
      const list = await operation.get_scripts(callbackQuery)
      const inline_keyboard = []
      list.forEach(item => {
        inline_keyboard.push([
          {
            text: item.name,
            callback_data: `story-${item.id}`
          }
        ])
      })
      inline_keyboard.push([
        {
          text: 'Return',
          callback_data: 'menu'
        }
      ])
      // 构建带有图片和按钮的消息
      const replyMarkup = {
        caption: '',
        reply_markup: {
          inline_keyboard: inline_keyboard
        }
      };
      bot.sendPhoto(chatId, source, replyMarkup);
    } else if (data.includes('story-')) {
      const script_id = data.replace('story-', '')
      const detail = await operation.get_script_detail(callbackQuery, script_id)
      const userInfo = await operation.get_userInfo(callbackQuery)
      const logo = detail.logo
      let caption = `You've selected the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nStarting this script will use ${detail.config.choose_jb} story limit.\nDo you want to continue?`
      if (detail.isDone) {
        caption = `You've complete the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nReset this script will use ${detail.config.reset_jb} story limit.\nDo you want to continue?`
      } else if (detail.isBegin) {
        caption = `You've selected the script: <b>${detail.name}</b>\n\nYou haven't completed the script yet.\nDo you want to continue?`
      }
      const replyMarkup = {
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Continue',
                callback_data: `beginScript-${script_id}`
              },
              {
                text: "Return",
                callback_data: `story`
              },
            ],
            [
              {
                text: 'Need More Limits?',
                callback_data: `tasks`
              },
            ]
          ]
        }
      };
      bot.sendPhoto(chatId, logo, replyMarkup)
    } else if (data.includes('beginScript-')) {
      const script_id = data.replace('beginScript-', '')
      const result = await operation.get_script_option(callbackQuery, script_id)

      if (result) {
        const source = `https://my-blog-seven-omega.vercel.app/static/gif/${result.source}.gif`
        const list = result.list
        const inline_keyboard = []
        let caption = `${result.title}\n\n${result.text}\n\nYou decide:\n`
        list.forEach((item, index) => {
          caption += `${item.label}\n`
          inline_keyboard.push([
            {
              text: optionList[index],
              callback_data: `option-${item.id}`
            }
          ])
        })

        // 构建带有图片和按钮的消息
        const replyMarkup = {
          caption: caption,
          reply_markup: {
            inline_keyboard: inline_keyboard
          }
        };
        const botMsg = await bot.sendVideo(chatId, source, replyMarkup, { contentType: 'application/octet-stream', filename: 'begin' });
        cache.set(`sendChoose${chatId}`, botMsg.message_id)
      } else {
        bot.sendMessage(chatId, 'limit is not enough!')
      }
    } else if (data.includes('option-')) {
      const option_id = data.replace('option-', '')

      const result = await operation.choose_option(callbackQuery, option_id)
      if (result.code == 0 || result.code == 400) {
        // const imageUrl = getLocalSource(`./public/gif/${result.data.source}.gif`)
        const imageUrl = `https://my-blog-seven-omega.vercel.app/static/gif/${result.data.source}.gif`
        
        const list = result.data.list
        const inline_keyboard = []
        let caption = `${result.data.title}\n\n${result.data.text}\n\n`
        list.forEach((item, index) => {
          if (result.data.shortOver || result.data.longOver) {
            inline_keyboard.push([
              {
                text: item.label,
                callback_data: `${item.value}-${item.id}`
              }
            ])
          } else {
            if (index == 0) {
              caption += 'You decide:\n'
            }
            caption += `${item.label}\n`
            inline_keyboard.push([
              {
                text: optionList[index],
                callback_data: `option-${item.id}`
              }
            ])
          }
        })
        // 构建带有图片和按钮的消息
        const replyMarkup = {
          caption: caption,
          reply_markup: {
            inline_keyboard: inline_keyboard
          }
        };
        if (result.msg) {
          bot.sendMessage(chatId, result.msg)
        }
        const botMsg = await bot.sendVideo(chatId, imageUrl, replyMarkup, { contentType: 'application/octet-stream', filename: 'begin' });
        try {
          const last_option = await cache.get(`sendChoose${chatId}`)
          bot.deleteMessage(chatId, last_option)
        } catch (error) {
          console.error(error)
          bot_logger().error(`deleteMessage-${chatId}`, `${error}`)
        }
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
                  callback_data: `story`
                },
              ],
            ]
          }
        };
        bot.sendPhoto(chatId, imageUrl, replyMarkup)
      }
    } else if (data.includes('over-')) {
      const option_id = data.replace('over-', '')
      const result = await operation.game_over(callbackQuery, option_id)
      // let caption = ''
      // if (result.code == 0) {
      //   caption = `Congratulations on completing the script +${result.data.add_score} Pts\n\n${result.data.username}\nScore: ${result.data.score}\nlimit: ${result.data.ticket}\ncomplete script: ${result.data.complete}`
      // } else {
      //   caption = result.msg
      // }
      // const imageUrl = 'https://img1.baidu.com/it/u=2483272398,915121754&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500'
      // const replyMarkup = {
      //   caption: caption,
      //   reply_markup: {
      //     inline_keyboard: [
      //       [
      //         {
      //           text: "Return",
      //           callback_data: `scripts`
      //         },
      //       ],
      //     ]
      //   }
      // };
      // bot.sendPhoto(chatId, imageUrl, replyMarkup)
      // const source = getLocalSource('./public/gif/welcome.gif')
      const source = 'https://my-blog-seven-omega.vercel.app/static/gif/welcome.gif'
      const text = `\nWelcome to (play)Lab Alpha!\n📜 You’ve just unlocked the first chapter of our journey!\n🧙‍♂️ In this alpha version, you’ll dive into a fun, interactive short story. Make your choices, earn points, and see where the plot takes you! These points will be crucial for upcoming rewards, so don’t miss a chance to build them up.\n💥 And guess what? More features from Click are on the way—you’re part of something big!\n\nSubscribe to our channel for more points and updates!(https://t.me/+CFUnnwrLIcgzOWFl)`;
      const replyMarkup = {
        caption: text,
        width: 640,
        height: 360,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Start Your Story",
                callback_data: 'story',
              },
            ],
            [
              {
                text: "Invite for Points",
                callback_data: 'share_link',
              },
            ],
            [
              {
                text: "Follow Our X (+1 Story Limit)",
                url: 'https://x.com/binance',
              },
            ],
            [
              {
                text: "Subscribe (+1 Story Limit)",
                url: 'https://t.me/+CFUnnwrLIcgzOWFl',
              }
            ],
            [
              {
                text: "Join Our Group (+1 Story Limit)",
                url: 'https://t.me/+CFUnnwrLIcgzOWFl',
              }
            ],
            [
              {
                text: "FAQ",
                callback_data: 'feedBack',
              }
            ],
            // [
            //   {
            //     text: "English",
            //     callback_data: "lang-en"
            //   },
            //   {
            //     text: "Руская",
            //     callback_data: "lang-russian"
            //   }
            // ],
            // [
            //   {
            //     text: "简体中文",
            //     callback_data: "lang-zh"
            //   },
            //   {
            //     text: "繁体中文",
            //     callback_data: "lang-zhTw"
            //   },
            // ]
          ]
        }
      };

      bot.sendVideo(chatId, source, replyMarkup, { contentType: 'application/octet-stream', filename: 'welcome' });
    } else if (data.includes('restart-')) {
      const option_id = data.replace('restart-', '')
      const script_id = await operation.accord_option_scriptId(option_id)
      const detail = await operation.get_script_detail(callbackQuery, script_id)
      const userInfo = await operation.get_userInfo(callbackQuery)
      const logo = detail.logo
      let caption = `You've selected the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nStarting this script will use ${detail.config.choose_jb} story limit.\nDo you want to continue?`
      if (detail.isDone) {
        caption = `You've complete the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nReset this script will use ${detail.config.reset_jb} story limit.\nDo you want to continue?`
      } else if (detail.isBegin) {
        caption = `You've selected the script: <b>${detail.name}</b>\n\nYou haven't completed the script yet.\nDo you want to continue?`
      }
      const replyMarkup = {
        caption: caption,
        parse_mode: 'HTML',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Continue',
                callback_data: `beginScript-${script_id}`
              },
              {
                text: "Return",
                callback_data: `story`
              },
            ],
            [
              {
                text: 'Need More Limits?',
                callback_data: `tasks`
              },
            ]
          ]
        }
      };
      bot.sendPhoto(chatId, logo, replyMarkup)
    } else if (data == 'share_link') {
      const config = await operation.get_config()
      const msg = `Invite Link: ${config.bot_url}?start=${btoa(chatId)}`
      bot.sendMessage(chatId, msg)
    }
    bot.answerCallbackQuery(queryId)
  } catch (error) {
    bot_logger().error('callback_query', `${error}`)
    console.error(error)
  }
});

