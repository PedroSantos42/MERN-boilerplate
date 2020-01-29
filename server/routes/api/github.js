const Counter = require('../../models/Counter');
const request = require('superagent')

module.exports = (app) => {

  let accessToken = ''

  app.get('/user/signin/callback', (req, res, next) => {
    const { query } = req

    const { code } = query

    if (!code) {
      return res.send({
        sucess: false,
        message: 'Error: no code'
      })
    }

    request
      .post('https://github.com/login/oauth/access_token')
      .send({
        client_id: 'dad1d3e3b4cc6feb04af',
        client_secret: 'fc2fc691ee92f0c87189e2a5cac75dece9344d2f',
        code: code
      })
      .set('Accept', 'application/json')
      .then(result => {
        const data = result.body
        accessToken = data.access_token
        res.send(data)
      })
  })

  app.get('/user/', (req, res, next) => {

    request
      .get('https://api.github.com/user')
      // .set('Authorization', 'token ' + accessToken)
      .set('Authorization', `token ${accessToken}`)
      .set('User-Agent', 'Demo')
      .then(result => {
        console.log('SUCESSO')
        console.log('result', result)

        // res.send(result.body)
        res.send(result.body)
      })
      .catch(error =>
        res.send(error))
  })

  app.get('/user/repos', (req, res, next) => {

    request
      .get('https://api.github.com/user/repos')
      .set('Authorization', `token ${accessToken}`)
      .set('User-Agent', 'Demo')
      .set('visibility', 'all')
      .then(result => {
        res.send(result.body)
      })
      .catch(error =>
        res.send(error))
  })
}
