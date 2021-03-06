const path = require('path')

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const config = require('config-lite')(__dirname)
const pkg = require('./package')

const router = require('./routes')

// 引入winston和express-winston记录日志
const winston = require('winston')
const expressWinston = require('express-winston')

// const bodyParser = require('body-parser')

const app = express()

// set template directory
app.set('views', path.join(__dirname, 'views'))

// set template engine
app.set('view engine', 'ejs')

// set static files directory
app.use(express.static(path.join(__dirname, 'public')))

// middlewares
app.use(session({
  name: config.session.key,
  secret: config.session.secret,
  resave: true, // force update
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge // 过期时间
  },
  store: new MongoStore({
    url: config.mongodb // mongodb address
  })
}))

// flash middleware
app.use(flash())

// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true
}))

app.locals.blog = {
  title: pkg.name,
  description: pkg.description
}

app.use(function (req, res, next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new (winston.transports.File)({
      filename: 'logs/success.log'
    })
  ]
}))

app.use('/signup', require('./routes/signup'))
router(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))

app.use(function (err, req, res, next) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
})

if (module.parent) {
  // 被require时则导出，用于测试
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
