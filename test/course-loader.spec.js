const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const expect = chai.expect

chai.use(chaiAsPromised)

const loadCourses = require('../src/utils/course-loader')

describe('course-loader', () => {
  it('should load all courses of directory', () => {
    return expect(loadCourses('courses')).to.eventually.be.fulfilled
  })

  it('should throw an error upon trying to read courses of non-existant directory', () => {
    return expect(loadCourses('nondir')).to.eventually.be.rejected
  })
})
