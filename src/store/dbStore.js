

const { v4: uuidv4 } = require('uuid')

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

    const team =  {
      id: uuidv4(),
      protected: false,
      name: data.name,
      created: new Date().toISOString(),
      lastaccess: new Date().toISOString()
    }
    db.gameCollection.insertOne(team, function(err, res) {
      if (err) throw err
      _loadTeams(db, io)
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
