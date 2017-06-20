import { x509 } from '@gp-technical/stack-redux-api'
import Xero from 'xero'

var api = new Xero(process.env.XERO_CONSUMER_KEY, process.env.XERO_CONSUMER_SECRET, x509.formatPrivateKey(process.env.XERO_RSA_PRIVATE_KEY))

const getUsers = async () => {
  return new Promise((resolve, reject) => {
    api.call('GET', '/Users', null, function (err, json) {
      if (err) return reject(err)
      resolve(json)
    })
  })
}

const getInvoices = async () => {
  return new Promise((resolve, reject) => {
    api.call('GET', '/Invoices', null, function (err, json) {
      if (err) return reject(err)
      resolve(json)
    })
  })
}

export default {getUsers, getInvoices}
