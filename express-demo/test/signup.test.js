const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../app')
const User = require('../lib/mongo').User

const testName1 = 'testName1'
const testName2 = 'nswbmw'
describe('signup', function () {
  describe('POST /signup', function () {
    const agent = request.agent(app)
    // 测试开始之前创建用户记录
    this.beforeEach(function (done) {
      User.create({
        name: testName1,
        password: '123456',
        avatar: '',
        gender: 'x',
        bio: ''
      }).exec().then(function () {
        done()
      }).catch(done)
    })
    // 测试完成删除用户记录
    this.afterEach(function (done) {
      User.deleteMany({ name: { $in: [testName1, testName2] } }).exec().then(function () {
        done()
      }).catch(done)
    })
    // 退出程序
    after(function (done) {
      process.exit()
    })
    // 用户名错误
    it('wrong name', function (done) {
      agent.post('/signup').type('form').field({ name: '' }).attach('avatar', path.join(__dirname, 'avatar.png')).redirects().end(function (err, res) {
        if (err) return done(err)
        assert(res.text.match(/名字请限制在1-10个字符/))
        done()
      })
    })
    // 性别错误的情况
    it('wrong gender', function (done) {
      agent.post('/signup').type('form').field({
        name: testName2,
        gender: 'a'
      }).attach('avatar', path.join(__dirname, 'avatar.png')).redirects().end(function (err, res) {
        if (err) return done(err)
        assert(res.text.match(/性别只能是m,f或x/))
        done()
      })
    })
    // 用户名被占用的情况
    it('duplicate name', function (done) {
      agent.post('/signup').type('form').field({
        name: testName1,
        gender: 'm',
        bio: 'noder',
        password: '123456',
        repassword: '123456'
      }).attach('avatar', path.join(__dirname, 'avatar.png')).redirects().end(function (err, res) {
        if (err) return done(err)
        assert(res.text.match(/用户名已被占用/))
        done()
      })
    })
    it('bio limit', function (done) {
      agent.post('/signup').type('form').field({
        name: testName2,
        gender: 'm',
        bio: '',
        password: '123456',
        repassword: '123456'
      }).attach('avatar', path.join(__dirname, 'avatar.png')).redirects().end(function (err, res) {
        if (err) return done(err)
        assert(res.text.match(/个人简介请限制在1-30个字符/))
        done()
      })
    })
    // 缺少头像的情况
    // 注册成功的情况
    it('success', function (done) {
      agent.post('/signup').type('form').field({
        name: testName2,
        gender: 'm',
        bio: 'noder',
        password: '123456',
        repassword: '123456'
      }).attach('avatar', path.join(__dirname, 'avatar.png')).redirects().end(function (err, res) {
        if (err) return done(err)
        assert(res.text.match(/注册成功/))
        done()
      })
    })
  })
})
