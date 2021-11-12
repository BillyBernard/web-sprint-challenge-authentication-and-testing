const Users = require('./model');

const checkUsernameExists = (req, res, next) => {
    const { username } = req.body;
    Users.getBy({ username })
      .then(exists => {
        if (!exists.length) {
          res.status(401).json({message: "invalid credentials"})
        } else {
          req.user = exists[0]
          next();
        }
      })
      .catch(next);
}

const checkUsernameOpen = (req, res, next) => {
    const { username } = req.body;
    Users.getBy({ username })
        .then(exists => {
            if (exists.length) {
                res.status(422).json({message: "username taken"})
            } else {
                next();
            }
        })
        .catch(next);
}

const checkCredentials = (req, res, next) => {
    const { username, password } = req.body;
    if (username === undefined || !password) {
        res.status(422).json({message: "username and password required"})
    } else {
        next()
    }
}

module.exports = {
    checkUsernameExists,
    checkUsernameOpen,
    checkCredentials,
  }