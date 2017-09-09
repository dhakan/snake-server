const {promisify} = require('util')
const fs = require('fs')
const readDirAsync = promisify(fs.readdir)
const readFileAsync = promisify(fs.readFile)
const logger = require('./logger')

const loadCourses = () => {
  const courses = []

  return readDirAsync('courses')
    .then(courseFilenames => {
      const promises = []

      courseFilenames.forEach(filename => {
        const promise = readFileAsync(`courses/${filename}`, {encoding: 'utf8'})
          .then(courseData => {
            courses.push(JSON.parse(courseData))
          })
          .catch(error => {
            logger.warn('Error parsing course', error)
            throw error
          })

        promises.push(promise)
      })

      return Promise.all(promises)
        .then(() => {
          return courses
        })
    })
    .catch(error => {
      logger.warn('Error parsing course directory', error)
      throw error
    })
}

module.exports = loadCourses
