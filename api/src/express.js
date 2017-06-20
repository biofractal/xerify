import { x509 } from '@gp-technical/stack-redux-api'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import winston from 'winston'
import server from 'express'
import https from 'https'
import path from 'path'
import util from 'util'

const start = async () => {
  try {
    const app = server()
    app.use(cookieParser(process.env.SSO_COOKIE_SECRET))
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.use(server.static(__dirname))

    // During development the NODE_TLS_REJECT_UNAUTHORIZED=0 environment variable is set to allow for self-signed TLS certs
    // You will need a cert authority (ca) certificate to use non-self-signed certs
    const tls = https.createServer({
      // ca: x509.formatPrivateKey(process.env.TLS_CA),
      key: x509.formatPrivateKey(process.env.TLS_KEY),
      cert: x509.formatPublicCertificate(process.env.TLS_CERT)
    }, app)

    app.get('/', (req, res) => {
      res.sendFile(path.resolve('index.html'))
    })

    app.get('/ping', (req, res) => {
      res.send(`The ${process.env.API_NAME} api is running : ${new Date().toLocaleString('en-GB')}`)
    })

    await tls.listen(process.env.API_PORT)
    winston.info(`Express TLS server started. The ${process.env.API_NAME} API is listening at ${process.env.API_ROOT}`)

    return {tls, app}
  } catch (inner) {
    const err = new Error('An error occurred while starting the Express TLS Server')
    err.inner = inner
    winston.error(util.inspect(err))
  }
}

export default { start}
