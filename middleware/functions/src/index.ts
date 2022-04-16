import * as bodyParser from 'body-parser'
import * as cors from 'cors'
import * as express from 'express'
import * as admin from 'firebase-admin'
import * as functions from 'firebase-functions'

export const projectConfig = {
    projectId: 'starcitizen-tools-1bba9',
    storageBucket: 'starcitizen-tools-1bba9',
    databaseURL: 'starcitizen-tools-1bba9',
}

// initialize firebase inorder to access its services
admin.initializeApp(projectConfig)

// initialize express serveryarn
export const APP = express()

const main = express()

// add the path to receive request and
// set json as bodyParser to process the body
main.use('/v1', APP)
main.use(bodyParser.json())
main.use(bodyParser.urlencoded({ extended: false }))
APP.use(cors())

// define google cloud function name
export const api = functions.https.onRequest(main)
