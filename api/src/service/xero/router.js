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
    return res.json(await xero.getUsers())
  } catch(err) {
    reportError(err, 'An error occurred fetching xero Users')
  }
})

router.get('/xero/invoices', async (req, res) => {
  try {
    return res.json(await xero.getInvoices())
  } catch(err) {
    reportError(err, 'An error occurred fetching xero invoices')
  }
})

router.get('/xero/items', async (req, res) => {
  try {
    return res.json(await xero.getItems())
  } catch(err) {
    reportError(err, 'An error occurred fetching xero items')
  }
})

router.get('/xero/contacts', async (req, res) => {
  try {
    if (req.query.email) {
      return res.json(await xero.getContactByEmail(req.query.email))
    }else {
      return res.json(await xero.getContacts())
    }
  } catch(err) {
    reportError(err, 'An error occurred fetching xero contact(s)')
  }
})

export default router
