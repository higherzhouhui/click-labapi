const operation = require('./data')
const fs = require('fs');

async function getMessage(id, key) {
  try {
    const lang = await operation.get_language(id)
    const messages = require(`../locales/${lang}/messages.json`)
    return messages[key]
  } catch (error) {
    console.error(error)
    return key
  }
}

function getLocalSource(url) {
  const source = fs.createReadStream(url)
  return source
}

async function startShow(bot, msg) {
  await operation.create_user(msg)
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const source = 'https://my-blog-seven-omega.vercel.app/static/gif/welcome.gif'
  const text = `\n<b>Welcome to (play)Lab Alpha!</b>\n\n📜 You’ve just unlocked the first chapter of our journey!\n\n🧙‍♂️ In this alpha version, you’ll dive into a fun, interactive short story. Make your choices, earn points, and see where the plot takes you! <b>These points will be crucial for upcoming rewards, so don’t miss a chance to build them up.</b>\n\n💥 And guess what? More features from Click are on the way—you’re part of something big!\n\n<a href='https://t.me/Click_announcement'>Subscribe to our channel for more points and updates!</a>`;
  const replyMarkup = {
    caption: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Start Your Story",
            callback_data: 'latest',
          },
        ],
        [
          {
            text: "Daily Check-In",
            callback_data: 'checkIn',
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
            url: 'https://x.com/Clickminiapp',
          },
        ],
        [
          {
            text: "Subscribe to Our Channel(+1 Story Limit)",
            url: 'https://t.me/Click_announcement',
          }
        ],
        [
          {
            text: "Join Our Group (+1 Story Limit)",
            url: 'https://t.me/Click_announcement',
          }
        ],
        [
          {
            text: "FAQ",
            callback_data: 'feedBack',
          }
        ],
      ]
    }
  };

  bot.sendVideo(chatId, source, replyMarkup);
}

async function checkShow(bot, msg) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const userInfo = await operation.get_userInfo(msg)
  const config = await operation.get_config()
  const replyMarkup = {
    caption: `<b>${userInfo.username}</b>\n\nScore:<b>${userInfo.score}</b> Pts\nStory Limit: <b>${userInfo.ticket}</b>\nComplete Story Times: <b>${userInfo.complete}</b>\nFriends: <b>${userInfo.count}</b>\nInvite Link: ${config.bot_url}?start=${btoa(chatId)}`,
    parse_mode: 'HTML',
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
}

function rewardsShow(bot, msg) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const text = `🎁 Start Your Day with More Rewards!\n\nCheck in every day to unlock growing bonuses. Complete your daily tasks to boost your points and reach the next level!`;
  const replyMarkup = {
    caption: text,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Daily Check-In",
            callback_data: 'checkIn',
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
            text: "Subscribe to Our Channel(+1 Story Limit)",
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
      ]
    }
  };

  bot.sendMessage(chatId, replyMarkup.caption, replyMarkup);
}

async function checkIn(bot, msg) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const signObj = await operation.user_checkIn(msg)
  if (signObj) {
    const caption = `<b>${signObj.username} CheckIn successful!</b>\n\n<b>+${signObj.ticket}</b> limit ${signObj.score > 0 ? `<b>+${signObj.score}</b> Pts` : ''}   Day: <b>${signObj.day}</b>\n\nCheckIn for <b>7</b> consecutive days and receive a great gift!\nInterrupt check-in and recalculate days\nCheck in available at <b>00:00 (UTC+0)</b> every day`
    const replyMarkup = {
      caption: caption,
      parse_mode: 'HTML',
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
}

async function menuShow(bot, msg) {
  let chatId;
  let username;
  if (msg.chat) {
    chatId = msg.chat.id
    username = msg.chat.username
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
    username = msg.message.chat.username
  }
  const config = await operation.get_config()
  const source = 'https://my-blog-seven-omega.vercel.app/static/gif/introduce.gif'
  const replyMarkup = {
    caption: `<b>Menu</b>`,
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Latest Story",
            callback_data: "latest"
          },
        ],
        [
          {
            text: "Choose Your Story",
            callback_data: "choose"
          }
        ],
        [
          {
            text: "Daily Rewards",
            callback_data: "rewards"
          },
        ],
        [
          {
            text: "Quick Refer",
            callback_data: "share_link"
          },
        ],
        [
          {
            text: "Guide",
            url: config.guide_url
          },
        ],
        [
          {
            text: "Current Points and Story Limits",
            callback_data: "checkIn"
          },
        ],
      ]
    }
  };
  bot.sendMessage(chatId, replyMarkup.caption, replyMarkup);
}

async function referShow(bot, msg) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const config = await operation.get_config()
  const text = `invite your friend  +${config.invite_friends_ratio}% reward\nYou're referral link: ${config.bot_url}?start=${btoa(chatId)}\n\nForget Netflix! Stop paying to watch boring shows! 🥱 Click in and take control of the interactive stories. Be the main character and even earn points for airdrops! 🚀`
  const replyMarkup = {
    parse_mode: 'HTML',
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
  bot.sendMessage(chatId, text, replyMarkup)
}

async function chooseShow(bot, msg) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
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
    caption: '<b>Please select the story you want to play!</b>',
    parse_mode: 'HTML',
    reply_markup: {
      inline_keyboard: inline_keyboard
    }
  };
  bot.sendMessage(chatId, replyMarkup.caption, replyMarkup);
}

async function latestShow(bot, msg, option_id) {
  let chatId;
  if (msg.chat) {
    chatId = msg.chat.id
  }
  if (msg.message && msg.message.chat) {
    chatId = msg.message.chat.id
  }
  const detail = await operation.get_script_detail(msg, option_id)
  const userInfo = await operation.get_userInfo(msg)
  const logo = detail.logo
  let caption = `You've selected the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nStarting this script will use <b>${detail.config.choose_jb}</b> story limit.\nDo you want to continue?`
  if (detail.isDone) {
    caption = `You've complete the script: <b>${detail.name}</b>\n\nYou currently have <b>${userInfo.ticket}</b> story limits.\nReset this script will use <b>${detail.config.reset_jb}</b> story limit.\nDo you want to continue?`
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
            callback_data: `beginScript-${detail.id}`
          },
          {
            text: "Return",
            callback_data: `menu`
          },
        ],
        [
          {
            text: "Choose Your Story",
            callback_data: "choose"
          }
        ],
        [
          {
            text: 'Need More Limits?',
            callback_data: `rewards`
          },
        ]
      ]
    }
  };
  bot.sendPhoto(chatId, logo, replyMarkup)
}

module.exports = {
  getMessage,
  getLocalSource,
  startShow,
  checkIn,
  menuShow,
  latestShow,
  rewardsShow,
  chooseShow,
  checkShow,
  referShow,
}