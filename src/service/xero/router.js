import express from 'express'
import xero from './xero-api'
import winston from 'winston'
import util from 'util'

const router = express.Router({mergeParams: true})
const reportError = (res, inner, message) => {
  const err = new Error(message)
  err.inner = inner
  winston.error(util.inspect(err))
  res.sendStatus(500)
}

router.get('/xero/ping', (req, res) => {
  res.send(`The 'xero' service endpoints have been succesfully mounted : ${new Date().toLocaleString('en-GB')}`)
})

router.get('/xero/user', async (req, res) => {
  try {
    return res.json(await xero.getUsers())
  } catch(err) {
    reportError(res, err, 'An error occurred fetching xero Users')
  }
})

router.get('/xero/invoice', async (req, res) => {
  try {
    return res.json(await xero.getInvoices())
  } catch(err) {
    reportError(res, err, 'An error occurred fetching xero invoices')
  }
})

router.get('/xero/item', async (req, res) => {
  try {
    return res.json(await xero.getItems())
  } catch(err) {
    reportError(res, err, 'An error occurred fetching xero items')
  }
})

router.get('/xero/contact', async (req, res) => {
  try {
    return res.json(await xero.getContacts())
  } catch(err) {
    reportError(res, err, 'An error occurred fetching xero contact(s)')
  }
})

router.post('/xero/invoice', async (req, res) => {
  var {body} = req
  if (!body || !body.contact || !body.description || !body.quantity || !body.itemCode) return res.sendStatus(400)

  try {
    return res.json(await xero.postInvoice(body))
  } catch(err) {
    reportError(res, err, 'An error occurred while creating the new xero invoice')
  }
})
export default router
