const { DataTypes } = require('sequelize')
const db = require('./database')
/** 用户表 */
const User = db.sequelize.define(
  'user',
  {
    authDate: { type: DataTypes.STRING, defaultValue: '' },
    chatInstance: { type: DataTypes.STRING, defaultValue: '' },
    hash: { type: DataTypes.STRING },
    query_id: { type: DataTypes.STRING },
    addedToAttachmentMenu: { type: DataTypes.STRING },
    allowsWriteToPm: { type: DataTypes.BOOLEAN },
    firstName: { type: DataTypes.STRING },
    user_id: { type: DataTypes.BIGINT },
    languageCode: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    score: { type: DataTypes.DOUBLE, defaultValue: 0 },
    isPremium: { type: DataTypes.BOOLEAN, defaultValue: false },
    startParam: { type: DataTypes.STRING, defaultValue: '0' },
    photoUrl: { type: DataTypes.STRING },
    invite_friends_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    invite_friends_game_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    game_score: { type: DataTypes.DOUBLE, defaultValue: 0 },
    check_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    task_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    bind_wallet_score: { type: DataTypes.BIGINT, defaultValue: 0 },
    check_date: { type: DataTypes.STRING, defaultValue: '' },
    ticket: { type: DataTypes.BIGINT, defaultValue: 10 },
    wallet: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    lang: { type: DataTypes.STRING, defaultValue: 'en' },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    complete: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'user',
    indexes: [
      {
        unique: true,
        fields: ['user_id']
      }
    ]
  }
)


/** 签到奖励列表  */
const CheckInReward = db.sequelize.define(
  'CheckInReward',
  {
    day: { type: DataTypes.INTEGER },
    ticket: { type: DataTypes.INTEGER },
    score: { type: DataTypes.INTEGER }
  },
  {
    tableName: 'CheckInReward'
  }
)


/** 剧本  */
const Script = db.sequelize.define(
  'script',
  {
    name: { type: DataTypes.STRING },
    logo: { type: DataTypes.STRING },
    bg: {type: DataTypes.STRING },
    intro: {type: DataTypes.STRING },
  },
  {
    tableName: 'script'
  }
)

/** 剧本详情  */
const ScriptDetail = db.sequelize.define(
  'scriptDetail',
  {
    pic: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING },
    sort: { type: DataTypes.INTEGER },
    script_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: 'scriptDetail'
  }
)

/** 选项  */
const ChooseOption = db.sequelize.define(
  'chooseOption',
  {
    label: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    sort: { type: DataTypes.INTEGER },
    scriptDetail_id: { type: DataTypes.INTEGER },
    script_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: 'chooseOption'
  }
)


/** 任务列表  */
const TaskList = db.sequelize.define(
  'tasklist',
  {
    name: { type: DataTypes.STRING },
    link: { type: DataTypes.STRING },
    linkType: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    ticket: { type: DataTypes.INTEGER },
    type: { type: DataTypes.STRING },
  },
  {
    tableName: 'tasklist'
  }
)



/** 用户选择  */
const UserChoose = db.sequelize.define(
  'userChoose',
  {
    user_id: { type: DataTypes.BIGINT },
    script_id: { type: DataTypes.INTEGER },
    detail_id: { type: DataTypes.INTEGER },
    option_id: { type: DataTypes.INTEGER },
  },
  {
    tableName: 'userChoose'
  }
)

/** 全局配置  */
const Config = db.sequelize.define(
  'config',
  {
    choose_jb: { type: DataTypes.INTEGER, defaultValue: 5 },
    reset_jb: { type: DataTypes.INTEGER, defaultValue: 10 },
    invite_friends_ratio: { type: DataTypes.INTEGER, defaultValue: 10 },
    open_new_jb: { type: DataTypes.INTEGER, defaultValue: 50 },
    click_jb: { type: DataTypes.INTEGER, defaultValue: 3 },
    done_jb: { type: DataTypes.INTEGER, defaultValue: 25 },
    done_first_jb: { type: DataTypes.INTEGER, defaultValue: 200 },
    invite: { type: DataTypes.INTEGER, defaultValue: 100 },
    feed_back: { type: DataTypes.INTEGER, defaultValue: 20 },
    bug_back: { type: DataTypes.INTEGER, defaultValue: 50 },
    bot_url: {type: DataTypes.STRING, defaultValue: 'https://t.me/thelostDog_bot'}
  },
  {
    tableName: 'config'
  }
)
/** 操作日志  */
const Event = db.sequelize.define(
  'event',
  {
    type: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    from_user: { type: DataTypes.BIGINT },
    from_username: { type: DataTypes.STRING, defaultValue: 'system' },
    to_user: { type: DataTypes.BIGINT, defaultValue: 0 },
    to_username: { type: DataTypes.STRING, defaultValue: 'system' },
    desc: { type: DataTypes.STRING },
    ticket: { type: DataTypes.INTEGER, defaultValue: 0 },
    script_id: { type: DataTypes.INTEGER },
    is_really: { type: DataTypes.BOOLEAN, defaultValue: true }
  },
  {
    tableName: 'event'
  }
)



/** Manager */
const Manager = db.sequelize.define(
  'manager',
  {
    account: { type: DataTypes.STRING },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING },
  },
  {
    tableName: 'manager'
  }
)

/** UserTask */
const UserTask = db.sequelize.define(
  'usertask',
  {
    task_id: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, default: 'start' },
    user_id: { type: DataTypes.BIGINT },
  },
  {
    tableName: 'usertask'
  }
)


/** UserTask */
const LevelList = db.sequelize.define(
  'levellist',
  {
    level: { type: DataTypes.INTEGER },
    score: { type: DataTypes.BIGINT },
    name: { type: DataTypes.STRING },
  },
  {
    tableName: 'levellist'
  }
)


/** UserTask */
const FeedBack = db.sequelize.define(
  'feedBack',
  {
    user_id: { type: DataTypes.BIGINT },
    text: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER },
    status: { type: DataTypes.STRING, defaultValue: '1' },
  },
  {
    tableName: 'feedBack'
  }
)

/** 机器人用户  */
const BotUser = db.sequelize.define(
  'botUser',
  {
    message_id: { type: DataTypes.INTEGER },
    user_id: { type: DataTypes.BIGINT },
    is_bot: { type: DataTypes.BOOLEAN, defaultValue: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    language_code: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING },
    lang: { type: DataTypes.STRING, defaultValue: 'en' },
    type: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
    invite_score: { type: DataTypes.INTEGER, defaultValue: 0 },
    juBen_score: { type: DataTypes.INTEGER, defaultValue: 0 },
    sign_score: { type: DataTypes.INTEGER, defaultValue: 0 },
    startParam: { type: DataTypes.STRING, defaultValue: '0' },
  },
  {
    tableName: 'botUser'
  }
)

/** 机器人操作日志  */
const BotEvent = db.sequelize.define(
  'botEvent',
  {
    message_id: { type: DataTypes.INTEGER },
    user_id: { type: DataTypes.BIGINT },
    is_bot: { type: DataTypes.BOOLEAN, defaultValue: false },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    username: { type: DataTypes.STRING },
    language_code: { type: DataTypes.STRING },
    type: { type: DataTypes.STRING },
    text: { type: DataTypes.STRING },
    desc: { type: DataTypes.STRING },
    score: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  {
    tableName: 'botEvent'
  }
)

module.exports = {
  User,
  Config,
  Event,
  Manager,
  CheckInReward,
  TaskList,
  UserTask,
  LevelList,
  BotUser,
  BotEvent,
  FeedBack,
  Script,
  ScriptDetail,
  ChooseOption,
  UserChoose,
}
