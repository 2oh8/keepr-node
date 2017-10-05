let Keeps = require('../models/keep')

module.exports = {
  boardKeeps: {
    path: '/vault/:vaultId/keeps/',
    reqType: 'get',
    method(req, res, next){
      let action = 'Get vault keeps'
      Keeps.find({vaultId: req.params.vaultId})
        .then(keeps => {
          res.send(handleResponse(action, keeps))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },

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