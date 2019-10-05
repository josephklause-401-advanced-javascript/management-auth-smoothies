module.exports = () => (req, res, next) => {
  if(req.user.roles) {
    req.user.roles.forEach(role => {
      if(role === 'admin') {
        next();
      }
    });
  } else {
    next({
      statusCode: 401,
      error: 'Unauthorized User'
    });
  }
};