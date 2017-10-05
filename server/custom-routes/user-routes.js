let Vaults = require('../models/vault')

module.exports = {
  userVaults: {
    path: '/uservaults',
    reqType: 'get',
    method(req, res, next){
      let action = 'Find User Vaults'
      Vaults.find({creatorId: req.session.uid})
        .then(vaults => {
          res.send(handleResponse(action, vaults))
        }).catch(error => {
          return next(handleResponse(action, null, error))
        })
    }
  },
  getUserById: {
    path: '/users/:userId',
    reqType: 'get',
    method(req, res, next){
      let action = 'findUserById'

    }
  },
  // sharedBoards: {
  //   path: '/sharedBoards',
  //   reqType: 'get',
  //   method(req, res, next){
  //     Boards.find({collaborators: { $in: req.session.uid}})
  //       .then(boards => {
  //         res.send(handleResponse(action, boards))
  //       }).catch(error => {
  //         return next(handleResponse(action, null, error))
  //       })
  //   }
  // }
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