const passport = require('passport');

class AuthController {
  static login(req, res) {
    const messages = req.flash('error');
    res.render('login', { messages });
  }

  static loginPost(req, res, next) {
    passport.authenticate('local', {
      successRedirect: '/contactos',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  }

  static logout(req, res, next) {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      res.redirect('/');
    });
  }

  static ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/login');
  }
}

module.exports = AuthController