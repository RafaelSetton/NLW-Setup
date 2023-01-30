import admin from 'firebase-admin'
import { existsSync } from 'fs'
import { join } from 'path'

let ServiceAccountKey;
if (existsSync(join(__dirname, 'ServiceAccountKey.json')))
    ServiceAccountKey = require('./ServiceAccountKey.json')
else
    ServiceAccountKey = JSON.parse(process.env.SERVICE_ACCOUNT_KEY!)

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccountKey)
})

export const db = admin.firestore()
