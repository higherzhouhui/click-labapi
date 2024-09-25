const { bot, bot_logger } = require('./index')
const operation = require('./data');
const { cache } = require('../model/database');
const { getMessage, getLocalSource } = require('./utils');

// 图片的URL
const imageUrl = 'https://img0.baidu.com/it/u=739050917,3625217136&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';

// 设置命令处理函数
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  try {
    await operation.create_user(msg)
    // 构建带有视频和按钮的消息
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
  } catch (error) {
    bot_logger().error(`${chatId} start error: ${error}`)
  }
});


bot.onText(/\/menu/, async (msg) => {
  try {
    const chatId = msg.chat.id
    const source = 'https://my-blog-seven-omega.vercel.app/static/gif/introduce.gif'
    const text = `\nWelcome to (play)Lab Alpha!\n📜 You’ve just unlocked the first chapter of our journey!\n🧙‍♂️ In this alpha version, you’ll dive into a fun, interactive short story. Make your choices, earn points, and see where the plot takes you! These points will be crucial for upcoming rewards, so don’t miss a chance to build them up.\n💥 And guess what? More features from Click are on the way—you’re part of something big!\n\nSubscribe to our channel for more points and updates!(https://t.me/+CFUnnwrLIcgzOWFl)`;
    const replyMarkup = {
      caption: `Hi ${msg.chat.username}\n${text}`,
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
  } catch (error) {

  }
});



bot.onText(/\/story/, async (msg) => {
  try {
    const chatId = msg.chat.id
    // const source = getLocalSource('./public/pic/redroom.png');
    const source = 'https://my-blog-seven-omega.vercel.app/static/pic/redroom.png'
    const list = await operation.get_scripts(msg)
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
  } catch (error) {

  }
});

bot.onText(/\/tasks/, async (msg) => {
  try {
    const chatId = msg.chat.id
    // 构建带有图片和按钮的消息
    const list = await operation.get_tasks(msg)
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
  } catch (error) {

  }
});


bot.onText(/\/checkin/, async (msg) => {
  try {
    const chatId = msg.chat.id
    const signObj = await operation.user_checkIn(msg)
    if (signObj) {
      const caption = `CheckIn successful\n\n+${signObj.ticket} limit ${signObj.score > 0 ? `+${signObj.score} Pts` : ''}   Day: ${signObj.day}\n\nCheckIn for 7 consecutive days and receive a great gift!\nInterrupt check-in and recalculate days\nCheck in available at 00:00 (UTC+0) every day`
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
  } catch (error) {
    bot_logger().error(`checkin Error: ${error}`)
  }
})


bot.onText(/\/user/, async (msg) => {
  try {
    const chatId = msg.chat.id
    const userInfo = await operation.get_userInfo(msg)
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
  } catch (error) {
    bot_logger().error(`user Error: ${error}`)
  }
})

bot.onText(/\/feedback/, async (msg) => {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'OK. Send me a FAQ and content. Please use this format:\n\b\bFAQ - content')
  } catch (error) {
    bot_logger().error(`feedback Error: ${error}`)
  }
})

bot.onText(/\/latest/, async (msg) => {
  try {
    const detail = await operation.get_script_detail(msg, script_id)
    const userInfo = await operation.get_userInfo(callbackQuery)
    const logo = detail.logo
    let caption = `You've selected the script: ${detail.name}\n\nYou currently have ${userInfo.ticket} story limits.\nStarting this script will use ${detail.config.choose_jb} story limit.\nDo you want to continue?`
    if (detail.isDone) {
      caption = `You've complete the script: ${detail.name}\n\nYou currently have ${userInfo.ticket} story limits.\nReset this script will use ${detail.config.reset_jb} story limit.\nDo you want to continue?`
    } else if (detail.isBegin) {
      caption = `You've selected the script: ${detail.name}\n\nYou haven't completed the script yet.\nDo you want to continue?`
    }
    const replyMarkup = {
      caption: caption,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Continue',
              callback_data: `beginScript-${script_id}`
            },
            {
              text: "Return",
              callback_data: `scripts`
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
  } catch (error) {
    bot_logger().error(`latest Error: ${error}`)
  }
})


bot.onText(/\/sendMessage/, async (msg) => {
  try {
    const chatId = msg.chat.id
    bot.sendMessage(chatId, 'OK. Send me a password and content. Please use this format:\n\nPWD - XXX123 - content')
  } catch (error) {
    bot_logger().error(`checkin Error: ${error}`)
  }
})

bot.on('message', async (msg) => {
  try {
    const chatId = msg.chat.id;
    const text = msg.text;
    const textArray = text.split(' - ')
    const cmd = textArray[0]
    if (cmd == 'FAQ') {
      const score = await operation.user_feedBack(msg)
      const replyMarkup = {
        caption: `Thank you for your feedback, we will continue to improve!！\nOnce adopted, we will gift it to you ${score} Pts!`,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Continue",
                callback_data: "feedBack"
              },
            ],
            [
              {
                text: "Return",
                callback_data: `menu`
              },
            ]
          ]
        }
      };
      bot.sendMessage(chatId, replyMarkup.caption, replyMarkup);
    } else if (cmd == 'PWD') {
      try {
        const pwd = textArray[1]
        const content = textArray[2]
        if (pwd !== 'abc123456') {
          bot.sendMessage(chatId, 'Password incorrect')
          return
        }
        const allUser = await operation.get_all_user(msg)
        allUser.forEach(item => {
          bot.sendMessage(item, content)
        })
      } catch (error) {
        bot_logger().error('PWD error:', `${error}`)
        bot.sendMessage(chatId, 'OK. Send me a password and content. Please use this format:\n\nPWD - XXX123 - content')
      }
    }
  } catch (error) {
    bot_logger().error(`message Error: ${error}`)
  }
})
