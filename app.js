const http = require('http')
const { spawn } = require('child_process')
const decrypt = require('./decrypt')

let PORT = 9527
let SECRET = 'SECRET'

process.argv.forEach(arg => {
  ;/PORT=/.test(arg) && (PORT = arg.match(/PORT=([\d]*)/)[1])
  ;/SECRET=/.test(arg) && (SECRET = arg.match(/SECRET=([\w\W]*)/)[1])
})

const app = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    console.log('--- Invalid request ---')
    res.writeHead(404)
    res.end()
    return
  }

  let content = ''
  req.on('data', chunk => {
    content += chunk
  })

  req.on('end', () => {
    const signature = req.headers['x-hub-signature']
    if (signature !== decrypt(content, SECRET)) {
      console.log('--- Invalid secret ---')
      res.writeHead(403)
      res.end()
      return
    }

    const event = req.headers['x-github-event']
    const payload = JSON.parse(content)
    const { repository, ref } = payload
    const { full_name } = repository
    const refs = ref.split('/')
    if (refs.lastIndexOf('master') !== refs.length - 1) {
      console.log('--- Not master branch ---')
      res.writeHead(204)
      res.end()
    }

    console.log(`--- Event: ${event}  Repo: ${full_name} ---`)

    const child = spawn('sh', [`./sh/${full_name}.sh`])
    let buffers = []
    child.stdout.on('data', buffer => {
      buffers.push(buffer)
    })
    child.stdout.on('end', () => {
      let log = Buffer.concat(buffers)
      console.log(log.toString())
      console.log(`--- ${full_name}.sh end ---`)
    })
    res.writeHead(204)
    res.end()
  })
})

app.listen(PORT, () => console.log(`Github webhooks listening on ${PORT}`))
