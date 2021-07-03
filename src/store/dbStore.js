

const { v4: uuidv4 } = require('uuid')

function newTeam(data) {
  return  {
    id: uuidv4(),
    name: data.name,
    assessments: {
      fiveDysfunctions: false,
      teamHealthCheck: false
    },
    created: new Date().toISOString(),
    lastaccess: new Date().toISOString()
  }
}

function _loadTeams(db, io) {
  db.gameCollection.find().toArray( function(err, res) {
    if (err) throw err
    io.emit('loadTeams', res)
  })
}

module.exports = {

  loadTeams: function(db, io, debugOn) {

    if (debugOn) { console.log('loadTeams') }

    _loadTeams(db, io)
  },

  addTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('addTeam', data) }

    const team = newTeam(data)
    db.gameCollection.insertOne(team, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  updateTeamName: function(db, io, data, debugOn) {

    if (debugOn) { console.log('updateTeamName', data) }

    db.gameCollection.updateOne({id: data.id}, {$set: {name: data.name}}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  },

  toggleAssessment: function(db, io, data, debugOn) {

    if (debugOn) { console.log('toggleAssessment', data) }

    db.gameCollection.findOne({id: data.id}, function(err, res) {
      if (err) throw err
      if (res) {
        res.assessments[data.assessment] = !res.assessments[data.assessment]
      }
      db.gameCollection.updateOne({id: data.id}, {$set: {assessments: res.assessments}}, function(err, res) {
        if (err) throw err
        _loadTeams(db, io)
      })
    })
  },

  deleteTeam: function(db, io, data, debugOn) {

    if (debugOn) { console.log('deleteTeam', data) }

    db.gameCollection.deleteOne({id: data.id}, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
    })
  }

}
