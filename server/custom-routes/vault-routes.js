let Keeps = require('../models/keep')

module.exports = {
  vaultKeeps: {
    path: '/vaults/:vaultId/keeps',
    reqType: 'get',
    method(req, res, next) {
      let action = 'Get vault keeps'
      Keeps.find({ vaultId: { $in: [req.params.vaultId] } })
        .then(keeps => {
          console.log(keeps)
          res.send(handleResponse(action, keeps))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  createVaultKeeps: {
    path: '/vaults/:vaultId/keeps',
    reqType: 'post',
    method(req, res, next) {
      let action = 'Post keeps to Vault'
      Keeps.create(req.body)
        .then((user) => {
          res.send({
            message: 'Successfully created Keep',
            data: user
          })
        })
        .catch(err => {
          res.send({ error: err })
        })
    },
    updateVaultKeeps: {
      path: '/keeps/:keepId',
      reqType: 'put',
      method(req, res, next) {
        let action = 'Update keeps in Vault'
        Keeps.findByIdAndUpdate(req.body._id, req.body)
          .then((user) => {
            res.send({
              message: 'Successfully updated Keep',
              data: user
            })
          })
          .catch(err => {
            res.send({ error: err })
          })
      },
    }
  }
}
function handleResponse(action, data, error) {
  var response = {
    action: action,
    data: data
  }
  if (error) {
    response.error = error
  }
  return response
}