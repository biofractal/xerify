import express from 'express'
import xero from './xero-api'
import winston from 'winston'
import util from 'util'

const router = express.Router({mergeParams: true})
const reportError = (inner, message) => {
  const err = new Error(message)
  err.inner = inner
  winston.error(util.inspect(err))
}

router.get('/xero/ping', (req, res) => {
  res.send(`The 'xero' service endpoints have been succesfully mounted : ${new Date().toLocaleString('en-GB')}`)
})

router.get('/xero/users', async (req, res) => {
  try {
    const json = await xero.getUsers()
    return res.json(json)
  } catch(err) {
    reportError(err, 'An error occurred fetching the xero json')
  }
})
router.get('/xero/invoices', async (req, res) => {
  try {
    const json = await xero.getInvoices()
    return res.json(json)
  } catch(err) {
    reportError(err, 'An error occurred fetching the xero invoices')
  }
})

export default router
