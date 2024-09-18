const { bot, bot_logger } = require('./index')
const operation = require('./data')

// 图片的URL
const imageUrl = 'https://raw.githubusercontent.com/higherzhouhui/demo-dapp-with-wallet/sweet/public/assets/logo.jpg?token=GHSAT0AAAAAACU7UOFLC5XZHPZDJQJ2RF7IZWENOOA';
// 超链接按钮的URL
const url = 'https://t.me/frenpetgame_bot/forkfrengame';

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
            text: "pyccknn",
            callback_data: "lang-pyccknn"
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
