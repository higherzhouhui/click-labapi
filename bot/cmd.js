const { bot, bot_logger } = require('./index')
const operation = require('./data');
const { cache } = require('../model/database');

// 图片的URL
const imageUrl = 'https://img0.baidu.com/it/u=739050917,3625217136&fm=253&fmt=auto&app=138&f=JPEG?w=800&h=800';

// 设置命令处理函数
bot.onText(/\/start/, async (msg) => {
  await operation.create_user(msg)
  const chatId = msg.chat.id
  // 构建带有图片和按钮的消息
  const text = `Welcome to Click! Дoбpo noЖаловать в Click! 欢迎来到Click! 歡迎來到Click!\n
Select your preferred language/Bыбepитenpeдno4иTaeMbЙ Я3bIK/设置你的首选语言/設定你的首逆語言
EnglishPyсCKИЙ简体中文繁體中文`;
  const replyMarkup = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "English",
            callback_data: "lang-en"
          },
          {
            text: "Руская",
            callback_data: "lang-russian"
          }
        ],
        [
          {
            text: "简体中文",
            callback_data: "lang-zh"
          },
          {
            text: "繁体中文",
            callback_data: "lang-zhTw"
          },
        ]
      ]
    }
  };

  bot.sendMessage(chatId, text, replyMarkup);
});



bot.onText(/\/choose/, async (msg) => {
  const chatId = msg.chat.id
  // 构建带有图片和按钮的消息
  const replyMarkup = {
    caption: 'TEXT\nTEXT', // 图片下方的文字
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Love",
            // url: url
            callback_data: "choose-love"
          },
        ],
        [
          {
            text: "Horror",
            callback_data: "choose-horror"
          }
        ],
        [
          {
            text: "Sus",
            callback_data: "choose-sus"
          },
        ],
        [
          {
            text: "jacky",
            callback_data: "choose-jacky"
          },
        ]
      ]
    }
  };

  // 发送图片和按钮
  bot.sendPhoto(chatId, imageUrl, replyMarkup);
});



bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id
  // 构建带有图片和按钮的消息
  const replyMarkup = {
    caption: '文本1\n文本2',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "剧本",
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
            callback_data: "feedBack"
          },
        ],
      ]
    }
  };
  bot.sendPhoto(chatId, imageUrl, replyMarkup);
});


bot.onText(/\/tasks/, async (msg) => {
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
});


bot.onText(/\/checkin/, async (msg) => {
  const chatId = msg.chat.id
  const singObj = await operation.user_checkIn(msg)
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
})


bot.onText(/\/user/, async (msg) => {
  const chatId = msg.chat.id
  const userInfo = await operation.get_userInfo(msg)
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
})

bot.onText(/\/feedback/, async (msg) => {
  const chatId = msg.chat.id
  bot.sendMessage(chatId, '请输入反馈内容：')
  cache.set(`${chatId}feedBack`, 1)
})

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  const isFeedBack = await cache.get(`${chatId}feedBack`)
  if (isFeedBack == 1 && text.length > 10) {
    const score = await operation.user_feedBack(msg)
    const tks = 'https://img2.baidu.com/it/u=3173117747,3631691921&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=282'
    const replyMarkup = {
      caption: `感谢您的反馈，我们将继续提升！\n一经采纳我们将赠与您${score}积分!`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "继续反馈",
              callback_data: "feedBack"
            },
          ],
          [
            {
              text: "返回",
              callback_data: `menu`
            },
          ]
        ]
      }
    };
    bot.sendPhoto(chatId, tks, replyMarkup);
  }
})
