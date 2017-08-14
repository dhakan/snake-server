const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const PORT = process.env.PORT || 3000

const NetworkHandler = require('./handler/NetworkHandler')

const Room = require('./objects/Room')

const networkHandler = new NetworkHandler(io)

const room = new Room(networkHandler) // eslint-disable-line no-unused-vars

server.listen(PORT)
