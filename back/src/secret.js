import crypto from 'crypto'

const secret = "Literary Haven"

const hash = crypto.createHmac('sha256', secret).update("Soy un campo secreto refresh").digest('hex')

console.log(hash);


