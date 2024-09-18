const {bot, bot_logger} = require('./index')
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