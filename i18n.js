const path = require('path')
const fs = require('fs')
const readline = require('readline')
const { once } = require('events')

/**
 * 1. 将该脚本放置在根目录 scripts/i18n.js 下
 * 2. init 入参调整为 java 项目中对应模块的语言目录下
 * 3. 控制台运行 node scripts/i18n.js
 * 4. 会在根目录下 i18n.json 中生成
 */

const getRegExp = (tagName, attrName) => {
  return new RegExp(
    `<${tagName}(?:[^'">]*(?:"[^"]*"|'[^']*')(?<! ${attrName}=))*[^'">]* ${attrName}=(?:'([^']+)'|"([^"]+)"|([^'" <>]+)).*(?:>[^<>]*<\/${tagName}|\/)>`
  )
}

async function readFileAndCache(dir, item, cache) {
  const fullPath = path.join(dir, item, '/strings.xml')
  const stream = fs.createReadStream(fullPath, 'utf-8')
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity })
  rl.on('line', line => {
    if (line === '</resources>') {
      console.log(item, '--读取结束')
      rl.close()
    }
    let v = line.match(/(?<=(<string[^>]*?>)).*?(?=(<\/string>))/g)
    let n = line.match(getRegExp('string', 'name'))
    if (Array.isArray(v) && v.length) {
      v = v[0]
    }
    if (Array.isArray(n) && n.length) {
      n = n[2]
    }
    if (n && v) {
      cache[n] = v
    }
  })
  await once(rl, 'close')
  return cache
}
/**
 *
 * @param {string} dir 历史 i18n 目录
 */
async function init(dir) {
  const i18nMap = {}
  const arr = fs.readdirSync(path.resolve(dir))
  console.log('=====开始遍历=====')
  for await (const item of arr) {
    if (!item.includes('values')) continue
    const k = item === 'values' ? 'en_US' : item.split('values-')[1]
    const cache = {}
    await readFileAndCache(dir, item, cache)
    i18nMap[k] = cache
  }
  console.log('=====开始写入=====')
  fs.writeFileSync(path.resolve(__dirname, `./i18n.json`), JSON.stringify(i18nMap))
  console.log('=====写入完成=====')
}

init(path.resolve(`D:\\huawei_project\\SmartSalesApp_Bussiness_Iretail\\iRetail\\salestarget\\src\\main\\res`))
