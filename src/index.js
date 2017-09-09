const loadCourses = require('./utils/course-loader')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const NetworkHandler = require('./handler/NetworkHandler')
const Room = require('./objects/Room')

const PORT = process.env.PORT || 3000

loadCourses()
  .then(courses => {
    const networkHandler = new NetworkHandler(io)
    const room = new Room({ // eslint-disable-line no-unused-vars
      networkHandler: networkHandler,
      courses: courses
    })

    server.listen(PORT)
  })
  .catch(error => {
    throw error
  })
