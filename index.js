const fs = require('fs-extra')
const express = require('express')
const fetch = require('node-fetch')
const app = express()
const gm = require('gm');

const sleep = t => new Promise(r => setTimeout(r, t))
app.get('/ProxyAutoConfiguration.js', (req, res) => {
  res.send(`function FindProxyForURL(url, host) {

    // use proxy for specific domains
    if (shExpMatch(host, "johnlewis.scene7.com")) {
        return "PROXY slow.codeite.net:12013";
    }

    // by default use no proxy
    return "DIRECT";
}
`)
})


app.use((req, res, next) => {
  console.log(req.path)
  next()
})

app.use(async (req, res) => {
  //
  const url = req.originalUrl;

  if (!url.startsWith('http')) {
    res.send('PROXY')
    return
  }

  if(url.includes('003166038')) {
    await sleep(5000)
  }

  const r = await fetch(url)
  const buffer = await r.buffer()

  // console.log('r.headers.raw():', r.headers.raw())

  Object.entries(r.headers.raw()).forEach(([field, values]) => {
    values.forEach(value => {
      res.header(field, value)
    })
  })
  res.header('content-length', buffer.length)

  res.status(r.status)


  // const progressive = await new Promise((resolve, reject) => {
  //   gm(buffer, 'image.jpg')
  //     .strip() // Removes any profiles or comments. Work with pure data
  //     .interlace('Line') // Line interlacing creates a progressive build up
  //     .quality(90) // Quality is for you to decide
  //     .toBuffer('JPEG',function (err, result) {
  //       if (err) reject(err);
  //       resolve(result);
  //     })
  // })

  for(let i = 0; i<buffer.length; i+=100) {
    res.write(buffer.slice(i, i+100))
    // await sleep(10)
  }
  res.end()
})

app.all('*', (req, res) => {
  res.statusMessage = 'No route matched'
  res.status(405).json({error: 'No route matched'})
})

const port = process.env.PORT || 12013
app.listen(port, err => {
  if (err) console.error(`Failed to listen on port ${port}`)
  else console.log(`The magic happens on port: ${port}`)
})