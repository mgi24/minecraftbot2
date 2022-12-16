const mineflayer = require('mineflayer')
const autoeat = require('mineflayer-auto-eat')
const config = require('./settings.json');
const bot = mineflayer.createBot({
  username: 'Raider',
  password: '',
  auth: config['bot-account']['type'],
  host: config.server.ip,
  port: config.server.port,
  version: config.server.version
})

// Load the plugin
bot.loadPlugin(autoeat)

bot.once('spawn', () => {
  bot.autoEat.options = {
    priority: 'foodPoints',
    startAt: 19,
    bannedFood: []
  }
})
// The bot eats food automatically and emits these events when it starts eating and stops eating.

bot.on('autoeat_started', () => {
  console.log('Auto Eat started!')
})

bot.on('autoeat_stopped', () => {
  console.log('Auto Eat stopped!')
})

bot.on('health', () => {
  if (bot.food === 20) bot.autoEat.disable()
  // Disable the plugin if the bot is at 20 food points
  else bot.autoEat.enable() // Else enable the plugin again
})