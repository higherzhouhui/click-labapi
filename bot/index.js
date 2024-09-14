const TelegramBot = require('node-telegram-bot-api');
const log4js = require('log4js')
const operation = require('./data')


// 用你的机器人Token替换YOUR_BOT_TOKEN
const TOKEN = '7410747456:AAGcGauv_WxucqpXnA-7GyfM9Tjhb45kwbA';

const bot = new TelegramBot(TOKEN, { polling: true });

// 图片的URL
const imageUrl = 'https://raw.githubusercontent.com/higherzhouhui/demo-dapp-with-wallet/sweet/public/assets/logo.jpg?token=GHSAT0AAAAAACU7UOFLC5XZHPZDJQJ2RF7IZWENOOA';
// 超链接按钮的URL
const url = 'https://t.me/frenpetgame_bot/forkfrengame';

// 设置命令处理函数
bot.onText(/\/start/, async (msg) => {
  const data = await operation.create_user(msg)
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
            // url: url
            callback_data: "lang-English"
          },
          {
            text: "pyccknn",
            callback_data: "lang-pyccknn"
          }
        ],
        [
          {
            text: "简体中文",
            callback_data: "lang-简体中文"
          },
          {
            text: "繁体中文",
            callback_data: "lang-繁体中文"
          },
        ]
      ]
    }
  };

  // 发送图片和按钮
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





// 处理按钮点击事件
bot.on('callback_query', (msg) => {
  const data = msg.data;
  const chatId = msg.message.chat.id;

  // 根据点击的按钮发送不同的消息
  if (data.includes('lang-')) {
    const replyMarkup = {
      caption: `Language set to ${data}💯\nTEXT \nTEXT`,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Invite for Points",
              // url: url
              callback_data: "invite-points"
            },
          ],
          [
            {
              text: "Play for Airdrop",
              callback_data: "play-airdrop"
            }
          ],
          [
            {
              text: "Follow X(+x Limit)",
              callback_data: "follow x"
            },
          ],
          [
            {
              text: "Join Channel",
              callback_data: "join Channel"
            },
          ],
          [
            {
              text: "Subscribe facebook",
              callback_data: "facebook"
            },
          ],
          [
            {
              text: "FAQ",
              callback_data: "FAQ"
            },
          ],
        ]
      }
    };
    bot.sendPhoto(chatId, imageUrl, replyMarkup);
  } else {
    bot.sendMessage(chatId, `You Click ${data}`)
  }

});



bot_logger().info('机器人开始运行...');


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
