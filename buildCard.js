const shell = require('shelljs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora')
const {
  BUILD_ALL_TYPE,
  SINGLE_TYPE,
  MULTIPLE_TYPE,
  RETURN_LAST_LEVEL_TYPE,
  NO_CACHE_TYPE,
  CARD_TYPE,
  SLEEP_TIME_DURATION,
  DEL_PAST_CARD_TYPE,
  RETAINED_PAST_CARD_TYPE,
  sleep,
  getAllEnvs,
  getCardPathList,
  getCommanderByQuery,
  getCache,
  setCache,
  getCommanderDataStructureByString,
  joinLog,
  ScriptLogger
} = require('./helpers/index')

/**
 * 卡片打包脚本
 */

/**
 * @description 获取 card 目录下所有的 card，例: ['all', 'card/iforce', 'card/iretail', 'card/data-analysis']
 * @returns
 */
async function getAllCard() {
  let cards = await fs.readdirSync(path.resolve(__dirname, `../${CARD_TYPE}`))
  cards = cards.map(n => `${CARD_TYPE}/${n}`)
  cards.unshift(BUILD_ALL_TYPE)
  return cards
}

/**
 * @description 选择环境和卡片
 * @returns {{ env: string, cards: string }} 选择的环境和卡片
 */
async function selectedEnvAndCard() {
  const allEnvs = await getAllEnvs()
  const cards = await getAllCard()
  const res = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: '请选择你要打包的环境?',
      choices: allEnvs
    },
    {
      type: 'list',
      name: 'cards',
      message: '请选择你要打包的卡片?',
      choices: cards
    }
  ])
  return { env: res.env, cards: res.cards }
}

/**
 * @description 卡片下钻逻辑
 * @param {{  cardPath: string; enableDrillDown: boolean; hasDrillDown: boolean  }} obj
 * @param {{ env: string; cardPath: string; type: string; delFlag: string  }} params 打包命令对象
 *
 */
async function drillDownLogic(obj, params) {
  // 所有的文件名
  let fileNames = await fs.readdirSync(path.resolve(__dirname, `../${obj.cardPath}`), { withFileTypes: true })
  const pathList = getCardPathList(obj.cardPath)
  const currCardPathName = pathList[pathList.length - 1]
  const hasCardFlag = fileNames.some(e => [`${currCardPathName}.js`, `${currCardPathName}.vue`].includes(e.name))
  // 如果当前选择的卡片路径类型是卡片，就提示当前目录下已无卡片
  if (hasCardFlag) {
    obj.enableDrillDown = false
    // 是否返回到上级菜单目录
    const checkHasReturnLastCardPath = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checked',
        message: `当前目录（${chalk.green(
          obj.cardPath
        )}）下已无卡片，是否确认打包该卡片，若选择否则返回到上级菜单，默认为true`,
        default: true
      }
    ])
    if (!checkHasReturnLastCardPath.checked) {
      obj.enableDrillDown = true
      obj.cardPath = pathList.slice(0, pathList.length - 1).join('/')
    } else {
      params.type = SINGLE_TYPE
    }
  } else {
    fileNames = fileNames.filter(e => e.isDirectory()).map(e => `${obj.cardPath}/${e.name}`)
    if (obj.cardPath !== CARD_TYPE) {
      fileNames.unshift(RETURN_LAST_LEVEL_TYPE)
    }
    const res1 = await inquirer.prompt([
      {
        type: 'list',
        name: 'card',
        message: '请选择你要打包的模块/卡片?',
        choices: fileNames
      }
    ])
    if (res1.card !== RETURN_LAST_LEVEL_TYPE) {
      obj.cardPath = res1.card
    } else {
      const pathList = getCardPathList(obj.cardPath)
      obj.cardPath = pathList.slice(0, pathList.length - 1).join('/')
    }
  }
}

/**
 * @description 通过询问/下钻生成最终的 cardPath，期间如果是卡片级别的话还要同步 params 的卡片类型
 * @param {string} initCard 初始化的cardName
 * @param {{ env: string; cardPath: string; type: string; delFlag: string  }} params 打包命令对象
 * @returns {string} 打包路径
 */
async function generateCardPath(initCard, params) {
  const obj = {
    // 初始化的 cardName
    cardPath: initCard,
    // 能否下钻（PS: 如果下层包含 [cardName].js 或者 [cardName].vue 就不再支持下钻，其他情况均支持下钻）
    enableDrillDown: true,
    // 选择是否下钻
    hasDrillDown: true
  }
  if (obj.cardPath === BUILD_ALL_TYPE) return obj.cardPath === CARD_TYPE ? BUILD_ALL_TYPE : obj.cardPath
  while (obj.enableDrillDown && obj.hasDrillDown) {
    // 是否下钻
    const result = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'down',
        message: `是否下钻?（下钻可继续选择模块/卡片，不下钻就打包整个 ${chalk.green(
          obj.cardPath === CARD_TYPE ? BUILD_ALL_TYPE : obj.cardPath
        )} 模块的卡片），默认为 true`,
        default: true
      }
    ])
    obj.hasDrillDown = result.down
    // 如果选择不下钻，则跳出该 while 循环
    if (!obj.hasDrillDown) break
    await drillDownLogic(obj, params)
  }
  return obj.cardPath === CARD_TYPE ? BUILD_ALL_TYPE : obj.cardPath
}

/**
 * @description 根据提示动态生成打包命令对象
 * @returns {{ env: string; cardPath: string; type: string; delFlag: string  }} 打包命令对象
 * env: 打包环境
 * cardPath: 打包的模块/卡片路径
 * type: 单卡片还是整个模块
 * delFlag: 是否删除 dist 文件夹
 */
async function generateCommander() {
  const params = {
    env: '', // 展示的时候可以考虑是否转换一层 sit、uat、icsl、prod 等
    type: MULTIPLE_TYPE, // 如果是卡片先判断里面文件夹是否包含 config/manifest.json，如果不包含可以重新选择
    cardPath: '', // 卡片/模块路径 string
    delFlag: RETAINED_PAST_CARD_TYPE
  }
  // TODO 询问是否删除 dist 文件夹，避免因打包的文件过多而导致上传错误的卡片（因为不同命令行的删除方法不同，因此该功能先去除）
  /**
   * const deletePastCardCheck = await inquirer.prompt([
   * {
   *   type: 'confirm',
   *   name: 'checked',
   *   message: '是否删除dist文件夹 (默认为 false)',
   *   default: false
   * }])
   * params['delFlag'] = deletePastCardCheck.checked ? DEL_PAST_CARD_TYPE : RETAINED_PAST_CARD_TYPE
   */

  const { env, cards } = await selectedEnvAndCard()
  params.env = env
  const cardPath = await generateCardPath(cards, params)
  params.cardPath = cardPath
  const confirmLogs = joinLog(
    `【环境】：`,
    chalk.red(params.env),
    `, 【卡片】：`,
    chalk.red(params.cardPath),
    `, 【dist 文件夹】：`,
    params.delFlag === DEL_PAST_CARD_TYPE ? chalk.red('删除') : '保留'
  )
  ScriptLogger.prototype.beforeBuildCardConfirmLog(confirmLogs)
  return params
}

/**
 * @description 执行打包任务
 * @param {{ env: string; cardPath: string; type: string }} commanderDataStructure 打包命令对象
 * @returns {Promise<void>}
 */
async function buildCommander(commanderDataStructure) {
  const { cardPath, env } = commanderDataStructure || {}
  const commander = getCommanderByQuery(commanderDataStructure)
  ScriptLogger.prototype.buildTipLog(commander)
  const begin = Date.now()
  const spinner = ora('Loading')
  spinner.start()
  // 静默1s，为了让用户看到打包命令
  await sleep(SLEEP_TIME_DURATION)
  spinner.stop()
  const { code } = await shell.exec(commander)
  if (code !== 0) {
    ScriptLogger.prototype.buildCardErrorLog(chalk.green(commander))
    shell.exit(1)
    return
  }
  // 生成日志字符串
  const logs = joinLog(
    `【环境】: `,
    chalk.red(env),
    `, 【卡片】: `,
    chalk.red(cardPath || ''),
    ` 打包完成`,
    ', 【打包时间】: ',
    chalk.red(((Date.now() - begin - SLEEP_TIME_DURATION) / 1000).toFixed(4)),
    chalk.red('s')
  )
  ScriptLogger.prototype.buildCardSuccessLog(logs)
}

const buildCard = async () => {
  ScriptLogger.prototype.buildCardLog()
  const cacheCommanderObjects = await getCache()
  const cachedCommanders = cacheCommanderObjects.map(e => getCommanderByQuery(e))
  ScriptLogger.prototype.buildCardCacheCommanderLog(cachedCommanders)
  const cacheCommanderStrings = cacheCommanderObjects.map(e => getCommanderByQuery(e))
  let useCache = null
  if (cacheCommanderStrings.length) {
    useCache = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checked',
        message: '是否使用缓存的命令?(默认不使用缓存的命令)',
        default: false
      }
    ])
  }
  // 无数据的时候 useCache 为 null
  if (useCache && useCache.checked) {
    cacheCommanderStrings.push(NO_CACHE_TYPE)
    const cacheCommanders = await inquirer.prompt([
      {
        type: 'list',
        name: 'commander',
        message: '选择缓存的命令?',
        choices: cacheCommanderStrings
      }
    ])
    if (cacheCommanders.commander !== NO_CACHE_TYPE) {
      await buildCommander(getCommanderDataStructureByString(cacheCommanders.commander))
      return
    }
  }

  let hasConfirm = false
  let commanderDataStructure = {}
  // 未确认，支持重新选择环境和卡片
  do {
    /**
     * 返回的结构是
     * {
     *    env: '', // 展示的时候可以考虑是否转换一层 sit、uat、icsl、prod 等
     *    type: MULTIPLE_TYPE, // 如果是卡片先判断里面文件夹是否包含 config/manifest.json，如果不包含可以重新选择
     *    cardPath: '' // 卡片/模块路径 string
     * }
     */
    const x = await generateCommander()
    // 二次确认
    const secondCheck = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'checked',
        message: '确定以上信息无误?选择 false 将重新选择环境和卡片 (默认为 true)',
        default: true
      }
    ])
    if (secondCheck.checked) {
      hasConfirm = true
      commanderDataStructure = x
    }
  } while (!hasConfirm)
  await setCache(cacheCommanderObjects, commanderDataStructure)
  await buildCommander(commanderDataStructure)
  shell.exit(0)
}

buildCard()
