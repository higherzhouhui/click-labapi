const operation = require('./data')
const fs = require('fs');

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

function getLocalSource(url) {
  const source = fs.createReadStream(url)
  return source
}

module.exports = {
  getMessage,
  getLocalSource,
}