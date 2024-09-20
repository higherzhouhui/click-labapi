const operation = require('./data')
async function getMessage(id, key) {
  try {
    const lang = await operation.get_language(id)
    const messages = require(`../locales/${lang}/messages.json`)
    return messages[key]
  } catch(error) {
    console.error(error)
    return key
  }
}


module.exports = {
  getMessage,
}