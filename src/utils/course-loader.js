const {promisify} = require('util')
const fs = require('fs')
const readFileAsync = promisify(fs.readFile)
const logger = require('./logger')

const loadCourses = () => {
  return readFileAsync('courses/test.json', {encoding: 'utf8'})
    .then(data => {
      return [JSON.parse(data)]
    })
    .catch(error => {
      logger.warn('Error parsing courses', error)
      throw error
    })
}

module.exports = loadCourses

