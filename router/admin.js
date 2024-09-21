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
        name: '遗忘之室',
        logo: 'https://img1.gamedog.cn/2023/12/12/2413736-2312121605070.jpg',
        bg: `故事背景：\n在一个被遗忘的古老图书馆深处，隐藏着一间神秘的密室。传说，这间密室是古代学者为了保护其最珍贵的知识而建造的，只有最聪明和勇敢的人才能解开密室的秘密，逃离这个被时间遗忘的地方。`,
        intro: `剧情简介：\n玩家扮演一名探险家，意外地在探索图书馆时发现了一扇隐藏的门。门后是一间装饰古朴、书架林立的密室。房间中央有一张桌子，上面放着一本破旧的日记和一些奇异的符号。日记中记载着密室的建造者留下的线索，以及一个挑战：解开密室中的谜题，找到出口。`,
        detail: [
          {
            pic: 'https://img1.baidu.com/it/u=10553331,2745495550&fm=253&fmt=auto&app=120&f=JPEG?w=665&h=380',
            text: '请问你有玩过密室逃脱吗？',
            sort: 0,
            script_id: 1,
            options: [
              {
                label: '有',
                value: '',
                sort: 0,
                ScriptDetail_id: 1,
              },
              {
                label: '没有',
                value: '',
                sort: 1,
                ScriptDetail_id: 1,
              },
            ]
          },
          {
            pic: 'https://img0.baidu.com/it/u=2171337979,1721743467&fm=253&fmt=auto&app=120&f=JPEG?w=522&h=221',
            text: '一个古老图书馆的内部，中央有一扇半隐在书架后的神秘门。门上雕刻着复杂的符号和图案，暗示着密室的存在\n如果深陷密室中，请问你会选择什么工具',
            sort: 0,
            script_id: 1,
            options: [
              {
                label: '蜡烛',
                value: '',
                sort: 0,
                ScriptDetail_id: 1,
              },
              {
                label: '铁锹',
                value: '',
                sort: 1,
                ScriptDetail_id: 1,
              },
              {
                label: '斧头',
                value: '',
                sort: 2,
                ScriptDetail_id: 1,
              },
              {
                label: '棍子',
                value: '',
                sort: 3,
                ScriptDetail_id: 1,
              },
            ]
          },
          {
            pic: 'https://media.9game.cn/gamebase/ieu-gdc-pre-process/images/20240816/5/21/ec28c01cda2b0f70094ae535581f921a.jpg',
            text: '一个古老图书馆的内部，中央有一扇半隐在书架后的神秘门。门上雕刻着复杂的符号和图案，暗示着密室的存在\n如果深陷密室中，请问你会选择什么工具',
            sort: 0,
            script_id: 1,
            options: [
              {
                label: '蜡烛',
                value: '',
                sort: 0,
                ScriptDetail_id: 1,
              },
              {
                label: '铁锹',
                value: '',
                sort: 1,
                ScriptDetail_id: 1,
              },
              {
                label: '斧头',
                value: '',
                sort: 2,
                ScriptDetail_id: 1,
              },
              {
                label: '棍子',
                value: '',
                sort: 3,
                ScriptDetail_id: 1,
              },
            ]
          },
        ]
      }
    ]
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
  init_baseData
}