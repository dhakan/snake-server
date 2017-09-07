const loadCourses = require('./utils/course-loader')
const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const NetworkHandler = require('./handler/NetworkHandler')
const Room = require('./objects/Room')

loadCourses()
  .then(courses => {
    const PORT = process.env.PORT || 3000
    const networkHandler = new NetworkHandler(io)
    const room = new Room({
      networkHandler: networkHandler,
      courses: courses,
    }) // eslint-disable-line no-unused-vars

    server.listen(PORT)
  })
  .catch(error => {
    throw error
  })

