var createError = require('http-errors');
const geoip = require('geoip-lite');
require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const flash = require('connect-flash');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var app = express();
app.use(express.urlencoded({ extended: false }));


// Configuración de sesión
app.use(session({
  secret: process.env.clavesecreta,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Configurar estrategia local
passport.use(new LocalStrategy(
  function(username, password, done) {
    // Aquí debería ir la lógica para buscar el usuario en la base de datos
    // Por simplicidad, estamos usando un usuario estático
    const user = { id: 1, username: 'QuieroPasarProgramacion2', password: '$2a$10$SJuMnNLO27UL/xAgReRog.dH70EbUf06kxM0aj01ptkTFsl1M3Zzm' };

    if (username !== user.username) {
      return done(null, false, { message: 'Nombre de Usuario incorrecto' });
    }

    bcrypt.compare(password, user.password, function(err, res) {
      if (res) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Contraseña incorrecta' });
      }
    });
  }
));

// Serializar y deserializar usuario
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Aquí debería ir la lógica para buscar el usuario en la base de datos
  // Por simplicidad, estamos usando un usuario estático
  const user = { id: 1, username: 'QuieroPasarProgramacion2' };
  done(null, user);
});

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "https://p2-32008046.onrender.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  // En esta función, puedes buscar al usuario en tu base de datos y devolver
  // el usuario (o crear uno nuevo si no existe).
  return done(null, profile);
}
));

app.get('/auth/github',
  passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect("https://p2-32008046.onrender.com/contactos");
  });

passport.use(new GoogleStrategy({
  clientID: process.env.Client_Id,
  clientSecret: process.env.SecretClient,
  callbackURL: "https://p2-32008046.onrender.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  // Aquí debería ir la lógica para buscar o crear el usuario en la base de datos
  // Por simplicidad, estamos usando un usuario estático
  const user = { id: profile.id, username: profile.displayName };
  return done(null, user);
}
));

// Rutas para Google OAuth
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect("https://p2-32008046.onrender.com/contactos");
  });

/* const db = require('./conf/db'); */
const ContactosController = require('./controllers/ContactosController');
const RECAPTCHA_SECRET_KEY= process.env.RECAPTCHA_SECRET_KEY

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  console.log(`Request URL: ${req.url}`);
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
app.use(express.static('public'));
app.set('trust proxy', true)
module.exports = app;