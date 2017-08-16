import { x509 } from '@gp-technical/stack-pack-util'
import Xero from 'xero'
import moment from 'moment'
import util from 'util'

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

const postInvoice = async ({contact, description, quantity, itemCode}) => {

  console.info('contact', contact)
  var invoice = {
    Type: 'ACCREC',
    Contact: {
      Name: contact
    },
    DueDate: moment().format(),
    LineAmountTypes: 'Exclusive',
    LineItems: [
      {
        Description: description,
        Quantity: quantity,
        ItemCode: itemCode
      }
    ],
    Status: 'AUTHORISED'
  }
  return new Promise((resolve, reject) => {
    api.call('POST', '/invoices?SummarizeErrors=false', invoice, function (err, {Response}) {
      if (err) return reject(err)
      console.info('json', util.inspect(Response, {depth: 6}))
      resolve(Response.Id)
    })
  })
}

export default {getUsers, getInvoices, getItems, getContacts, postInvoice}
