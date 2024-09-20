const { bot, bot_logger } = require('./index')
const operation = require('./data')

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
});