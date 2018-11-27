const path = require('path')

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')

const config = require('config-lite')(__dirname)
const pkg = require('./package')

const router = require('./routes')

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

app.use('/signup', require('./routes/signup'))
router(app)

app.use(function (err, req, res, next) {
  console.error(err)
  req.flash('error', err.message)
  res.redirect('/posts')
})

app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})
