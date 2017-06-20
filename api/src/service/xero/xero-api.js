import { x509 } from '@gp-technical/stack-redux-api'
import Xero from 'xero'

var api = new Xero(process.env.XERO_CONSUMER_KEY, process.env.XERO_CONSUMER_SECRET, x509.formatPrivateKey(process.env.XERO_RSA_PRIVATE_KEY))

const get = (path) => {
  return new Promise((resolve, reject) => {
    api.call('GET', `/${path}`, null, function (err, json) {
      if (err) return reject(err)
      resolve(json)
    })
  })
}
const getUsers = async () => {
  return get('users')
}

const getInvoices = async () => {
  return get('invoices')
}

const getItems = async () => {
  return get('items')
}

const getContacts = async () => {
  return get('contacts')
}

const getContactByEmail = async (email) => {
  const where = encodeURIComponent(`EmailAddress="${email}"`)
  return get(`contacts?where=${where}`)
}

const postInvoice = async () => {
  return new Promise((resolve, reject) => {
    api.call('GET', '/items', null, function (err, json) {
      if (err) return reject(err)
      resolve(json)
    })
  })
}

export default {getUsers, getInvoices, getItems, getContacts, getContactByEmail}
