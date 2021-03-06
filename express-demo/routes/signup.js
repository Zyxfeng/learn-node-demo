const express = require('express')
const router = express.Router()
const checkNotLogin = require('../middlewares/check').checkNotLogin
const UserModel = require('../models/user')

const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')

// GET /signup 注册页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function (req, res, next) {
  // res.send('signup')
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  let password = req.fields.password
  const repassword = req.fields.repassword

  // check the params
  try {
    if (!(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字请限制在1-10个字符')
    }
    if (['m', 'f', 'x'].indexOf(gender) === -1) {
      throw new Error('性别只能是m,f或x')
    }
    if (!(bio.length >= 1 && bio.length <= 30)) {
      throw new Error('个人简介请限制在1-30个字符')
    }
    if (!req.files.avatar.name) {
      throw new Error('缺少头像')
    }
    if (password.length < 6) {
      throw new Error('密码至少6个字符')
    }
    if (password !== repassword) {
      throw new Error('两次密码不一致')
    }
  } catch (e) {
    // 注册失败，异步删除上传的头像
    fs.unlink(req.files.avatar.path, (result) => { console.log(result) })
    req.flash('error', e.message)
    return res.redirect('/signup')
  }
  const avatar = req.files.avatar.path.split(path.sep).pop()
  password = sha1(password)

  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio,
    avatar: avatar
  }
  UserModel.create(user)
    .then(function (result) {
      user = result.ops[0]
      // 删除密码等敏感信息
      delete user.password
      req.session.user = user
      req.flash('success', '注册成功')
      res.redirect('/posts')
    })
    .catch(function (e) {
      // 注册失败，异步删除上传的头像
      fs.unlink(req.files.avatar.path, (result) => { console.log(result) })
      if (e.message.match('duplicate key')) {
        req.flash('error', '用户名已被占用')
        res.redirect('/signup')
      }
      next()
    })
})

module.exports = router
