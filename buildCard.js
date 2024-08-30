const shell = require('shelljs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora')

/**
 * 卡片打包脚本
 */

function filterFileNames(names) {
  return names
    .filter(e => e.includes('.env'))
    .map(e => e.split('.env.')[1])
    .filter(Boolean)
}
const BUILD_ALL_CARDS_TYPE = 'all'
function sleep(t = 1000) {
  return new Promise(resolve => {
    setTimeout(resolve, t)
  })
}

async function setCache(lines, commander) {
  const hasCache = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'checked',
      message: '是否缓存该打包命令?(默认不缓存)',
      default: false
    }
  ])
  if (hasCache.checked) {
    try {
      const cacheCommander = `npx ${commander}`
      lines.unshift(cacheCommander)
      lines = lines.slice(0, 5)
      await fs.writeFileSync(path.resolve(__dirname, './.build_history'), lines.join('\n'))
      console.log(
        chalk.green(`
=======缓存命令 ${chalk.red(cacheCommander)} 写入成功========
    `)
      )
    } catch (err) {
      console.log(
        chalk.red(`
=======缓存命令 ${cacheCommander} 写入失败========
    `)
      )
    }
  }
}

async function buildCommander(commander, cardName) {
  console.log(
    chalk.green(`打包命令为：
${commander}
      `)
  )
  const begin = Date.now()
  const spinner = ora('Loading')
  spinner.start()
  await sleep(1000)
  spinner.stop()
  await shell.exec(commander)
  console.log(
    chalk.green(`
=======buildCard.js========
卡片 ${cardName || ''} 打包完成, 打包时间: ${Date.now() - begin - 1000}ms
请上传 dist 目录下面的卡片 zip 包
=======buildCard.js========
`)
  )
}

const buildCard = async () => {
  console.log('=======buildCard.js========')
  const data = await fs.readFileSync(path.resolve(__dirname, './.build_history'), 'utf-8')
  // 无数据的时候读出来的是 ['']
  let lines = data.split(/\r?\n/).filter(Boolean)
  console.log(lines, '--缓存的命令')
  let useCache = null
  if (lines.length) {
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
    console.log('--用缓存')
    const cacheCommanders = await inquirer.prompt([
      {
        type: 'list',
        name: 'commander',
        message: '选择缓存的命令?',
        choices: lines
      }
    ])
    console.log(cacheCommanders.commander, '--a')
    await buildCommander(cacheCommanders.commander, '')
    return
  }

  // 所有的文件名
  const allFileNames = await fs.readdirSync(path.resolve(__dirname, '../'))
  const allEnvs = filterFileNames(allFileNames)
  let cards = await fs.readdirSync(path.resolve(__dirname, '../card'))
  cards = cards.map(n => `card/${n}`)
  cards.unshift(BUILD_ALL_CARDS_TYPE)
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
  let cardName = res.cards
  let commander = `cross-env ENV_MODE=${res.env} card-cli build ${res.cards} --pack`
  if (cardName !== BUILD_ALL_CARDS_TYPE) {
    // 是否下钻到卡片
    const hasDrillDown = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'down',
        message: `是否下钻到卡片?（下钻就只打包一个卡片，不下钻就打包整个 ${res.cards} 模块的卡片）`,
        default: true
      }
    ])
    if (hasDrillDown.down) {
      // 所有的文件名
      let fileNames = await fs.readdirSync(path.resolve(__dirname, `../${res.cards}`))
      fileNames = fileNames.map(e => `${res.cards}/${e}`)
      const res1 = await inquirer.prompt([
        {
          type: 'list',
          name: 'card',
          message: '请选择你要打包的卡片?',
          choices: fileNames
        }
      ])
      cardName = res1.card
      commander = `cross-env ENV_MODE=${res.env} card-cli build ${cardName} --pack`
    }
  }

  console.log(
    chalk.green(`您要打包的是
****************************
【环境】：${res.env}, 【卡片】：${cardName}
****************************
`)
  )

  // 二次确认
  const secondCheck = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'checked',
      message: '确定以上信息无误?(默认为 true)',
      default: true
    }
  ])

  if (!secondCheck.checked) return
  await setCache(lines, commander)
  await buildCommander(commander, chalk.red(cardName))
}
buildCard()
