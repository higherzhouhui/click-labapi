var log4js = require('log4js')

const Model = require('../model/index')

async function init_manager() {
  try {
    const list = [
      { account: 'admin', password: 'a12345678' },
      { account: '18516010812', password: 'a123456' },
    ]
    list.map(async item => {
      await Model.Manager.create(item)
    })
  } catch (error) {
    admin_logger().error('init manage error:', error)
  }
}

async function init_rewardList() {
  try {
    const reward = require('../data/reward')
    reward.list.map(async item => {
      await Model.CheckInReward.create(item)
    })
  } catch (error) {
    admin_logger().error('init CheckInReward error:', error)
  }
}

async function init_taskList() {
  try {
    const list = require('../data/task')
    list.list.map(async item => {
      await Model.TaskList.create(item)
    })
  } catch (error) {
    admin_logger().error('init tasklist error:', error)
  }
}

async function init_levelList() {
  try {
    const list = require('../data/level')
    list.list.map(async item => {
      await Model.LevelList.create(item)
    })
  } catch (error) {
    admin_logger().error('init LevelList error:', error)
  }
}

async function init_scripts() {
  try {
    const scripts = [
      {
        name: 'Red Room',
        logo: './public/pic/redroom.png',
        bg: ``,
        intro: ``,
        detail: [
          {
            source: 'redroom',
            title: '序章\n神秘的邀請',
            text: `你的父親失踪已久。你和艾琳娜是多年好友，最近她的妹妹也神秘失踪，這一連串的神秘事件一直困擾著你們。某天晚上，你和艾琳娜一起在公寓裡，你的手機突然收到一個神秘鏈接，打開後是一個直播間，直播間的標題是「紅房子」，下方有一個Enter的選項。`,
            options: [
              {
                label: `A：接受邀請，進入直播。`,
                value: '1A',
              },
              {
                label: `B：拒絕邀請，認為這是陷阱。`,
                value: '1B',
              },
            ]
          },
          {
            source: '1-1',
            title: '第一章\n進入紅房子',
            text: `你和艾琳娜進入了直播，畫面顯示一名女子被綁在由像是巨大的怪物的組織和器官構成的的房間內，與其說是由怪物的身體組織或器官構成的房間，不如說是怪物的體內！直播間裡還有其他觀眾起哄決定對這位女子的行刑方式。\n艾琳娜（急切）：「這……好像是我的妹妹！」`,
            key: '1A',
            options: [
              {
                label: `A：嘗試阻止直播。`,
                value: '2A',
              },
              {
                label: `B：說服艾琳娜先觀察以找到更多線索再想辦法解救她的妹妹。`,
                value: '2A',
              },
            ]
          },
          {
            source: '1-2',
            title: '第一章\n怪事連連',
            text: `你們選擇拒絕進入紅房子，這時你們感覺今天的氣氛出奇的安靜。你們往窗外望去，整個城市都泛著紅光，準確地說，整個城市像被一個巨大的不知名的紅色物體吞噬了。你們望向門口，似乎也冒著和那個直播間的封面一樣的紅光……`,
            key: '1B',
            options: [
              {
                label: `A：帶上艾琳娜逃離家中。`,
                value: '2C',
              },
              {
                label: `B：決定再次查看那個奇怪的邀請。`,
                value: '2D',
              },
            ]
          },
          {
            source: '2-1',
            title: '第二章\n無法阻止的直播',
            text: `你們嘗試在聊天室裡請求其他觀眾不要傷害艾琳娜的妹妹，可觀眾看到竟然會有人在這個聊天室裡請求他們不要做變態的事情反而更興奮了。這時，一道紅光閃過，你們竟然被吸進了和直播間的場景一樣的地方。\n艾琳娜（驚恐）：「發生了什麼？………」\n你：「這個地方……不……這個東西，像是有生命一樣……」`,
            key: '2A',
            options: [
              {
                label: `A：和艾琳娜尋找逃跑的方法。`,
                value: '3A',
              },
              {
                label: `B：你們認為這裡應該就是艾琳娜的妹妹被綁架的地方，試圖深入探索這裡，解救艾琳娜的妹妹。`,
                value: '3B',
              },
            ]
          },
          {
            source: '2-1',
            title: '第二章\n我在哪裡',
            text: `艾琳娜強忍著難過的心情和你一起觀看直播。這時，一道紅光閃過，你們竟然被吸進了和直播間的場景一樣的地方。\n艾琳娜：「這個地方像不像我妹妹被綁架的地方？」`,
            key: '2B',
            options: [
              {
                label: `A：和艾琳娜尋找逃跑的方法。`,
                value: '3A',
              },
              {
                label: `B：你們認為這裡應該就是艾琳娜的妹妹被綁架的地方，試圖深入探索這裡，解救艾琳娜的妹妹。`,
                value: '3B',
              },
            ]
          },
          {
            source: '2-2',
            title: '第二章\n耀眼的紅光',
            text: `你和艾琳娜趕緊逃出了家門，可是一切都來不及了，紅光離你們越來越近，直到你們被吞噬。這個紅光裡似乎有很多張扭曲的面孔，在你失去意識之前，你似乎看見了……你失蹤已久的父親，他的面孔不像是其他的面孔驚恐猙獰，他彷彿在笑……\n你：「父親？」`,
            key: '2C',
            shortOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '1-1',
            title: '第二章\n進入紅房子',
            text: `你重新打開了那個鏈接，進入了那個直播間。畫面顯示一名女子被綁在由像是巨大的怪物的組織和器官構成的的房間內，與其說是由怪物的身體組織或器官構成的房間，不如說是怪物的體內！直播間裡還有其他觀眾起哄決定對這位女子的行刑方式。\n艾琳娜：「這個女人，好像我的妹妹！」`,
            key: '2D',
            options: [
              {
                label: `A：嘗試阻止直播。`,
                value: '2A',
              },
              {
                label: `B：說服艾琳娜先觀察以找到更多線索再想辦法解救她的妹妹。`,
                value: '2A',
              },
            ]
          },
          {
            source: '2-2',
            title: '第三章\n血肉的牢籠',
            text: `你們嘗試逃跑，可這個地方像是沒有邊界一般。你們已經精疲力盡了。這時你的耳邊似乎響起了父親的聲音……你心想難道父親也被困在了這裡嗎？最終你們累倒在了這裡，紅光離你們越來越近，這個紅光裡似乎有很多張扭曲的面孔，在你失去意識之前，你似乎看見了……你失蹤已久的父親，他的面孔不像是其他的面孔驚恐猙獰，他彷彿在笑……\n你：「父親？」`,
            key: '3A',
            shortOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '3',
            title: '第三章\n父親的秘密',
            text: `你們試圖找到艾琳娜的妹妹，終於在一個角落裡發現了她的身影。與直播時所見到的不同的是，她的身體已經與這個紅房子融合在一起了。這時，你們都聽見了一陣聲音，是你父親的聲音！\n艾琳娜（驚恐）：「妹妹！」\n你：「爸爸！」`,
            key: '3B',
            options: [
              {
                label: `A：尋找父親。`,
                value: '4A',
              },
              {
                label: `B：先試圖解救艾琳娜的妹妹`,
                value: '4B',
              },
            ]
          },
          {
            source: '4',
            title: '第四章\n怪物',
            text: `你拼命吶喊著「爸爸」！這時你感覺到，一陣聲音從你的腳下傳來，充斥了整個空間。你驚訝地摔倒在了地上……\n父親：「不用找了，你們就站在我的身體上……」\n你：「爸爸！發生了什麼？」\n父親：「對不起，是我創造了這個怪物……一切都太遲了，紅房子吞噬了我，也會吞噬你們，別白費力氣了。但是……」\n父親繼續說道：「兒子，加入我吧，我們可以把整個世界都給吞噬掉！」`,
            key: '4A',
            options: [
              {
                label: `A：相信父親的話，與紅房子融合。`,
                value: '5A',
              },
              {
                label: `B：尋找機會殺死父親。`,
                value: '5B',
              },
            ]
          },
          {
            source: '4-1',
            title: '第四章\n我該救誰',
            text: `你們嘗試強行從牆壁裡把艾琳娜的妹妹救出來，紅房子似乎感受到了痛一般，發出了一聲聲的呻吟，這一聲聲的呻吟越聽越像你父親的聲音……\n紅房子：「兒子，兒子……」\n你：「爸爸？！發生了什麼？」\n父親：「別再從我的身體裡把她拉出來了，這樣我會死掉的！」`,
            key: '4B',
            options: [
              {
                label: `A：繼續試圖將艾琳娜的妹妹與紅房子分離。`,
                value: '5C',
              },
              {
                label: `B：相信父親的話，看著紅房子一點一點把艾琳娜的妹妹吞噬。`,
                value: '5D',
              },
            ]
          },
          {
            source: '5',
            title: '第五章\n神秘的邀請',
            text: `Michael的父親失踪已久。某天晚上，Michael的手機突然收到一個神秘鏈接，打開後是一個直播間，直播間的標題是「紅房子」，下方有一個Enter的選項……`,
            key: '5A',
            longOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '5-1',
            title: '第五章\n坍塌',
            text: `你無法接受這一切。這時你注意到，這個紅房子的深處似乎有一個酷似心臟的東西在跳動。你走近那裡，拼盡全力往這顆巨大的心臟打著一拳又一拳。\n父親：「兒子，快停下來！」\n你的行為似乎有了反應，紅房子正在坍塌……`,
            key: '5B',
            longOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '5-1',
            title: '第五章\n毀滅',
            text: `你沒有聽從父親的話，繼續嘗試強行從牆壁裡把艾琳娜的妹妹救出來。\n父親：「兒子，快停下來！」\n你們的努力似乎成功了？可是就在這時，眼前的一切變得模糊，你們看著紅房子一點一點在坍塌……`,
            key: '5C',
            longOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '5-2',
            title: '第五章\n傀儡',
            text: `你彷彿被支配了一般，眼睜睜地看著艾琳娜的妹妹被紅房子吞噬……\n父親：「很好，我的兒子……」\n父親繼續說道：「現在輪到你了，艾琳娜……」`,
            key: '5D',
            longOver: true,
            options: [
              {
                label: `A：結束劇本。`,
                value: 'over',
              },
              {
                label: `B：重新開始。`,
                value: 'restart',
              },
            ]
          },
          {
            source: '',
            title: '',
            text: ``,
            key: 'T',
            options: [
              {
                label: ``,
                value: '',
              },
              {
                label: ``,
                value: '',
              },
            ]
          },
        ]
      }
    ]
    
    scripts.forEach(async (item, sIndex) => {
      const script_id = await Model.Script.create(item)
      item.detail.forEach(async (detail, dIndex) => {
        const scriptDetail_id = await Model.ScriptDetail.create({
          source: detail.source,
          sort: dIndex,
          text: detail.text,
          key: detail.key,
          title: detail.title,
          longOver: detail.longOver || false,
          shortOver: detail.shortOver || false,
          script_id: script_id.dataValues.id,
        })
        
        detail.options.forEach(async (option, oIndex) => {
           await Model.ChooseOption.create({
            label: option.label,
            sort: oIndex,
            value: option.value,
            scriptDetail_id: scriptDetail_id.dataValues.id,
            script_id: script_id.dataValues.id,
          })
        })
      })
    })
  } catch (error) {
    admin_logger().error('init Config error:', error)
  }
}


async function init_systemConfig() {
  try {
    await Model.Config.create({})
  } catch (error) {
    admin_logger().error('init Config error:', error)
  }
}

//----------------------------- private method --------------
// 配置日志输出
function admin_logger() {
  log4js.configure({
    appenders: {
      out: { type: 'console' },
      app: {
        type: 'dateFile',
        filename: './logs/admin/admin',
        pattern: 'yyyy-MM-dd.log',
        alwaysIncludePattern: true
      }
    },
    categories: {
      default: { appenders: ['out', 'app'], level: 'debug' }
    }
  })
  var logger = log4js.getLogger('admin')
  return logger
}

async function init_baseData() {
  await init_scripts();
  await init_taskList();
  await init_levelList();
  await init_manager();
  await init_rewardList();

  await init_systemConfig();


  const config = await Model.Config.findAll()
  if (config) {
    console.log(config)
    return 'successful!'
  } else {
    return 'fail'
  }
}


module.exports = {
  init_manager,
  init_rewardList,
  init_systemConfig,
  init_taskList,
  init_levelList,
  init_scripts,
  init_baseData
}