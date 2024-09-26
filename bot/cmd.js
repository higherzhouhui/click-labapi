const { bot, bot_logger } = require('./index')
const operation = require('./data');
const { cache } = require('../model/database');
const utils = require('./utils');

// 图片的URL
const imageUrl = 'https://img0.baidu.com/it/u=739050917,3625217136&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';

// 设置命令处理函数
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id
  try {
    utils.startShow(bot, msg)
  } catch (error) {
    bot_logger().error(`${chatId} start error: ${error}`)
  }
});


bot.onText(/\/menu/, async (msg) => {
  try {
    utils.menuShow(bot, msg)
  } catch (error) {
    bot_logger().error(`menu error: ${error}`)
  }
});


bot.onText(/\/latest/, async (msg) => {
  try {
    utils.latestShow(bot, msg)
  } catch (error) {
    bot_logger().error(`latest Error: ${error}`)
  }
})


bot.onText(/\/choose/, async (msg) => {
  try {
    utils.chooseShow(bot, msg)
  } catch (error) {
    bot_logger().error(`choose Error: ${error}`)
  }
});

bot.onText(/\/rewards/, async (msg) => {
  try {
    utils.rewardsShow(bot, msg)
  } catch (error) {
    bot_logger().error(`rewards Error: ${error}`)

  }
});

bot.onText(/\/refer/, async (msg) => {
  try {
    
  } catch (error) {
    bot_logger().error(`checkin Error: ${error}`)
  }
})

bot.onText(/\/guide/, async (msg) => {
  try {
    
  } catch (error) {
    bot_logger().error(`checkin Error: ${error}`)
  }
})

bot.onText(/\/check/, async (msg) => {
  try {
    utils.checkShow(bot, msg)
  } catch (error) {
    bot_logger().error(`check Error: ${error}`)
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
