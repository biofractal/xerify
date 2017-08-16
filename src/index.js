import 'babel-polyfill'
import { sharedServices, rest } from '@gp-technical/stack-pack-api'
import localServices from './service'
import express from './express'
import winston from 'winston'
import Logger from 'le_node' // eslint-disable-line no-unused-vars
import util from 'util'

const services = {...localServices, ...sharedServices}

winston.add(winston.transports.Logentries, { token: process.env.API_LOGENTRIES_TOKEN })
winston.info('---------------------------')

;(async () => {
  try {
    // Starts an HTTPS express server
    const {tls, app} = await express.start(services)
    // Discovers and mounts any endpoints found in service/router.js files
    // Note the baseUrl prefix. This is an optional namespace for all the
    // rest endpoints provided by the individual services.
    rest.setRoutes({
      app,
    services})
  } catch (inner) {
    const err = new Error(`An error occurred whilst starting the ${process.env.API_NAME} API`)
    err.inner = inner
    winston.error(util.inspect(err))
  }
})()
