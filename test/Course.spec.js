const chai = require('chai')
const expect = chai.expect
const sinon = require('sinon')
const factories = require('./factories')
const Grid = require('../src/objects/Grid')
const Course = require('../src/objects/Course')

describe('Course', () => {
  describe('walls setup', () => {
    beforeEach(() => {
      sinon.spy(Course.prototype, '_initializeWalls')
      sinon.spy(Grid.prototype, 'occupyGridSquare')
      this.course = factories.CourseFactory.build()
    })

    afterEach(() => {
      Course.prototype._initializeWalls.restore()
      Grid.prototype.occupyGridSquare.restore()
    })

    it('should initialize walls upon having been instantiated', () => {
      expect(Course.prototype._initializeWalls.called).to.equal(true)
    })

    it('should initialize walls correctly', () => {
      expect(this.course._walls.length).to.equal(2)
    })

    it('should occupy one grid square per wall', () => {
      expect(Grid.prototype.occupyGridSquare.callCount).to.equal(2)
    })
  })
})
