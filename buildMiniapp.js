const shell = require('shelljs')
const inquirer = require('inquirer')
const chalk = require('chalk')
const ora = require('ora')
const {
  SLEEP_TIME_DURATION,
  sleep,
  ScriptLogger,
  joinLog,
  // BUILD_ALL_TYPE,
  getAllEnvs,
  getAppName
} = require('./helpers/index')
const { getAllCard } = require('./helpers/file')

/**
 * 底座包打包脚本
 */

/**
 * @description 根据命令对象生成打包命令，例 {"env":"a1","appName":"data-analysis"} -> card-cli build:miniapp DataAnalysis phx a1 --no-upgrade
 * @param {cardPath: string; env: string; type: string; delFlag: string} commanderDataStructure
 * @returns string
 */
function getCommanderByQuery(commanderDataStructure) {
  const appName = commanderDataStructure.appName
  const appEnv = commanderDataStructure.env
  return `card-cli build:miniapp ${appName} phx ${appEnv} --no-upgrade`
}

/**
 * @description 执行打包任务
 * @param {{ env: string; appName: string}} commanderDataStructure 打包命令对象
 * @returns {Promise<void>}
 */

/**
 * @description 通过命令行选择生成底座包的命令数据结构
 * @returns {{ env: string; appName: string; }} 打包命令对象
 */
async function generateMiniAppCommanderObj() {
  const allEnvs = await getAllEnvs()
  const allApps = await getAllCard(true)
  // TODO 目前底座包打包不支持多包打包并行，所以先删除全部的选项，等后面card-cli 脚手架支持了再放开
  allApps.shift()
  const res = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: '请选择你要打包的底座包环境?',
      choices: allEnvs
    },
    {
      type: 'list',
      name: 'app',
      message: '请选择你要打包的底座包?',
      choices: allApps
    }
  ])
  const appName = getAppName(res.app)
  const confirmLogs = joinLog(`【环境】：`, chalk.red(res.env), `, 【底座包】：`, chalk.red(appName))
  ScriptLogger.prototype.beforeBuildMiniAppConfirmLog(confirmLogs)
  return { env: res.env, appName }
}

const buildMiniApp = async () => {
  ScriptLogger.prototype.buildMiniAppLog()
  let commanderDataStructure = {}
  let hasConfirm = false
  do {
    const cacheObj = await generateMiniAppCommanderObj()
    // 二次确认
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'secondCheck',
        message: '确定以上信息无误?(默认为true)',
        default: true
      }
    ])
    if (confirm.secondCheck) {
      hasConfirm = true
      commanderDataStructure = cacheObj
    }
  } while (!hasConfirm)

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
    ScriptLogger.prototype.buildMiniAppErrorLog(commander)
    shell.exit(1)
    return
  }
  const logs = joinLog(
    `【环境】：`,
    chalk.red(commanderDataStructure.env),
    `,【底座包】: `,
    chalk.red(commanderDataStructure.appName),
    ` 打包完成`,
    `,【打包时间】: `,
    chalk.red(((Date.now() - begin - SLEEP_TIME_DURATION) / 1000).toFixed(4)),
    chalk.red('s')
  )
  ScriptLogger.prototype.buildMiniAppSuccessLog(logs)
  shell.exit(0)
}
buildMiniApp()
