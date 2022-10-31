const express = require('express')
const path = require('path')
const querystring = require('querystring')

const app = express()

app.get('/json/:filename', (req, res) => {
  const filepath = path.resolve(__dirname, `./statics.mirrormedia.mg/json/${req.params.filename}`)
  res.sendFile(filepath, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.get('/api/v2/:k3_resource', (req, res) => {
  const resource = req.params.k3_resource
  const query = '?' + querystring.stringify(req.query)
  const filepath = path.resolve(__dirname, `./api/v2/${resource}/${query}`)
  res.sendFile(filepath, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.get('/api/v2/membership/v0/getposts', (req, res) => {
  const query = '?' + decodeURIComponent(querystring.stringify(req.query))
  const flashNewsQuery = '?where={"categories":{"$in":["5979ac0de531830d00e330a7","5979ac33e531830d00e330a9","57e1e16dee85930e00cad4ec","57e1e200ee85930e00cad4f3"]},"isAudioSiteOnly":false}&clean=content&max_results=10&page=1&sort=-publishedDate'

  let filename

  switch(query) {
    case flashNewsQuery: {
      filename = 'flash-news.json'
      break
    }
  }

  const filepath = path.resolve(__dirname, `./api/v2/membership/v0/getposts/${filename}`)
  res.sendFile(filepath, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
})

app.listen(8080, () => {
  console.log('\033[32m[mock server]\033[0m started mock server on 0.0.0.0:8080, url: http://localhost:8080')
})
