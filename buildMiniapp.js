const shell = require('shelljs')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const fs = require('fs')
const ora = require('ora')

/**
 * 底座包打包脚本
 */

function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

const buildMiniApp = async () => {
  console.log('=======buildMiniapp.js========')
  // 所有的文件名
  const fileNames = await fs.readdirSync(path.resolve(__dirname, '../'))
  const envs = fileNames
    .filter(e => e.includes('.env'))
    .map(e => e.split('.env.')[1])
    .filter(Boolean)
  const apps = await fs.readdirSync(path.resolve(__dirname, '../card'))
  const res = await inquirer.prompt([
    {
      type: 'list',
      name: 'env',
      message: '请选择你要打包的底座包环境?',
      choices: envs
    },
    {
      type: 'list',
      name: 'app',
      message: '请选择你要打包的底座包?',
      choices: apps
    }
  ])
  let appName = res.app
  try {
    appName = res.app
      .split('-')
      .map(e => firstUpperCase(e))
      .filter(Boolean)
      .join('')
  } catch (err) {
    console.log(chalk.red('========格式化错误，请确认文件名称是否正确========'))
    process.exit(1)
    return
  }

  console.log(
    chalk.green(`您要打包的是
****************************
【环境】：${chalk.red(res.env)}, 【底座包】：${chalk.red(appName)}
****************************
`)
  )

  // confirm
  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'secondCheck',
      message: '确定以上信息无误?(默认为true)',
      default: true
    }
  ])

  if (!confirm.secondCheck) return

  const commander = `card-cli build:miniapp ${appName} phx ${res.env}`

  console.log(
    chalk.green(`打包命令为：
${commander}
      `)
  )
  let begin = Date.now()
  await shell.exec(commander)

  console.log(
    chalk.green(`
=======buildMiniapp.js========
底座包 ${chalk.red(res.app)} 打包完成, 打包时间: ${Date.now() - begin}ms
请上传 dist 目录下面的底座 phx.zip 包
=======buildMiniapp.js========
`)
  )
}
buildMiniApp()
