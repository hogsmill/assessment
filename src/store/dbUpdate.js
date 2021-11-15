
module.exports = {

  run: function(db) {

    db.assessmentsCollection.find().toArray(function(err, res) {
      if (err) throw err
      if (res.length) {
        for (let i = 0; i < res.length; i++) {
          if (res[i].quarter) {
            const quarter = res[i].quarter.replace(/^Q/, '')
            db.assessmentsCollection.updateOne({'_id': res[i]._id}, {$set: {quarter: quarter}}, function(err, ) {
              if (err) throw err
            })
          }
        }
      }
    })
  }
}
