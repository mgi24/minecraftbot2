const mineflayer = require('mineflayer')
const autoeat = require('mineflayer-auto-eat')
const config = require('./settings.json');

var pi = 3.14159;

var reconnect = 0;
const botlist = [];

function newBot(botname) {
  const bot = mineflayer.createBot({
    username: botname,
    password: '',
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  })
  


  bot.on('chat', (username, message)=> {
    const arrmessage=message.split(" ")
    let index=botlist.indexOf(arrmessage[0]);
    if (index != -1) {

    console.log('ada bot')
    if (arrmessage[1] == 'quit') {
      botlist.splice(index, 1)
      bot.chat(`Bot List: ${botlist}`)
      bot.quit('')
      
    }
    if (arrmessage[1]=='prepare'){
      equipItem('iron_sword','hand')
      
      
      
    }
    if (arrmessage[1]=='attack'){
      let tipeattack=''
      if (arrmessage[2]==1){tipeattack='Armor Stand'}
      if (arrmessage[2]==2){tipeattack='Cave Spider'}
      let target=bot.nearestEntity(e => e.mobType==tipeattack && bot.entity.position.distanceTo(e.position) < 2)
      if (!target){bot.chat(`gaada ${tipeattack} bgst!`)}
      else{
        bot.chat(`jotos  ${tipeattack} sekali`)
        bot.attack(target)
      }
    if((arrmessage[3]=='setiap')&&(target)){
        console.log(`ada command`)
        bot.chat(`Attck ${tipeattack} selamanya`)
        testTarget(tipeattack,arrmessage[4]);
    }

    }
    function testTarget(tipemobs,delay){
        let timing=delay;
        loop(timing);
        function mainAttack(tipemobs){
            equipItem('diamond_sword', 'hand')
            let targetmobs = bot.nearestEntity(e => e.mobType == tipemobs && bot.entity.position.distanceTo(e.position) < 2)
            if (!targetmobs) {
                    bot.chat(`${tipemobs}nya ilang boss! Izin off`)
                    botlist.splice(index, 1)
                    bot.quit('');

                }
                else {
                    bot.attack(targetmobs)
                    //bot.chat(`ada target!`)
                }
        }
        
        function loop(waktu) {
            setTimeout(() => {
                
                if ((bot.health<20)&&(bot.food<20)){
                    timing=3100;
                    bot.autoEat.enable()
                    bot.autoEat.eat()
                    
                }else{
                    mainAttack(tipemobs);
                    bot.autoEat.disable();
                    timing=delay;
                }
                loop(timing);
            },waktu)
        }
        bot.on('health',() => {console.log(`${bot.name} HP ${bot.health} Hunger ${bot.food} XP ${bot.experience.level}`)})




        
        
        
        
         
    };  
  }
  if (message=='position'){bot.chat(`My Coords = ${bot.entity.position}`)}
  if (message=='health'){bot.chat(`I have ${bot.health} health, ${bot.food} food and ${bot.experience.level} level`)}
  if (message=='makan'){bot.autoEat.enable()}
})

bot.on('entitySpawn', (entity) => {
  if (entity.type === 'mob') {
    if (entity.mobType=='Vex'){
      bot.chat(`ADA VEX CUK, KABOOR!!!`)
      botlist.splice((botlist.indexOf(botname)),1)
      bot.quit()
    }
    
  }  
})
bot.loadPlugin(autoeat)

bot.once('spawn', () => {
  bot.autoEat.options = {
    priority: 'foodPoints',
    startAt: 14,
    bannedFood: []
  }
})



bot.on('autoeat_started', () => {
  console.log('Auto Eat started!')
})

bot.on('autoeat_stopped', () => {
  console.log('Auto Eat stopped!')
})


function equipItem (name, destination) {
  const item = itemByName(name)
  if (item) {
    bot.equip(item, destination, checkIfEquipped)
  } else {
    console.log(`I have no ${name}`)
  }

  function checkIfEquipped (err) {
    if (err) {
      console.log(`cannot equip ${name}: ${err.message}`)
    } else {
      console.log(`equipped ${name}`)
    }
  }
}
function itemByName (name) {
  return bot.inventory.items().filter(item => item.name === name)[0]
}


bot.on('kicked', (reason) => console.log('\x1b[33m', `[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))

bot.on('kicked', () => botlist.splice((botlist.indexOf(botname)),1))
bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))













}













function createBot() {
  const bot = mineflayer.createBot({
    username: config['bot-account']['username'],
    password: config['bot-account']['password'],
    auth: config['bot-account']['type'],
    host: config.server.ip,
    port: config.server.port,
    version: config.server.version
  })

  bot.on('chat', (username, message) => {
    if (message=='reset lists'){
      botlist=[];
    }

    if (message === 'health') healthcheck()
    
    const arrmessage = message.split(" ");
    if (arrmessage[0] == 'summon') {
      botlist.push(arrmessage[1])
      bot.chat(`Bot List: ${botlist}`)
      newBot(arrmessage[1]);
    }
    let index=botlist.indexOf(arrmessage[0]);
    if (index != -1){
      if (arrmessage[1]=='forcetp'){bot.chat(`/tp ${arrmessage[0]} ${arrmessage[2]}`)}
      
    }


  
    if (message === 'console') { console.log('test') }
  if (message === 'list bot'){bot.chat(`Bot List: ${botlist}`)}
  if (message == 'info') {bot.chat(`${config.quest}`)}

})

bot.on('playerJoined', function() {bot.chat(`Selamat Datang di PCGID Season 2! ketik 'info' untuk target hari ini!`)})



  
bot.once("spawn", function () {

  console.log("\x1b[33m[BotLog] Bot joined to the server", '\x1b[0m')

  if (config.utils['auto-auth'].enabled) {
    console.log("[INFO] Started auto-auth module")

    var password = config.utils['auto-auth'].password
    setTimeout(function () {
      bot.chat(`/register ${password} ${password}`)
      bot.chat(`/login ${password}`)
    }, 500);

    console.log(`[Auth] Authentification commands executed.`)
  }


  if (config.utils['chat-messages'].enabled) {
    console.log("[INFO] Started chat-messages module")
    var messages = config.utils['chat-messages']['messages']

    if (config.utils['chat-messages'].repeat) {
      var delay = config.utils['chat-messages']['repeat-delay']
      let i = 0

      let msg_timer = setInterval(() => {
        bot.chat(`${messages[i]}`)

        if (i + 1 == messages.length) {
          i = 0
        } else i++
      }, delay * 1000)
    } else {
      messages.forEach(function (msg) {
        bot.chat(msg)
      })
    }
  }







  bot.on('time', function (time) {
    var yaw = Math.random() * pi - (0.5 * pi);
    var pitch = Math.random() * pi - (0.5 * pi);
    bot.look(yaw, -90, false);



  });
})

function healthcheck() {

  bot.chat(`I have ${bot.health} health and ${bot.food} food`)
}





bot.on("chat", function (username, message) {
  if (config.utils['chat-log']) {
    console.log(`[ChatLog] <${username}> ${message}`)
  }
})

bot.on("goal_reached", function () {
  console.log(`\x1b[32m[BotLog] Bot arrived to target location. ${bot.entity.position}\x1b[0m`)
})

bot.on("death", function () {
  console.log(`\x1b[33m[BotLog] Bot has been died and was respawned ${bot.entity.position}`, '\x1b[0m')
  bot.chat(`BOT has been died, respawn location ${bot.entity.position}`)
})

if (config.utils['auto-reconnect']) {
  bot.on('end', function () {
    createBot()


  })
}

bot.on('kicked', (reason) => console.log('\x1b[33m', `[BotLog] Bot was kicked from the server. Reason: \n${reason}`, '\x1b[0m'))
bot.on('error', err => console.log(`\x1b[31m[ERROR] ${err.message}`, '\x1b[0m'))


}




createBot()
