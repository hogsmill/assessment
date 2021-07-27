
const questions = [
  {
    question: 'Team members are passionate and unguarded in their discussion of issues',
    dysfunction: 'Fear of Conflict'
  },
  {
    question: 'Team members call out one another\'s deficiencies or unproductive behaviours',
    dysfunction: 'Avoidance of Accountability'
  },
  {
    question: 'Team members know what their peers are working on and how they contribute to the team goals',
    dysfunction: 'Lack of Commitment'
  },
  {
    question: 'Team members quickly and genuinely apologise if they do something damaging to the team',
    dysfunction: 'Absence of Trust'
  },
  {
    question: 'Team members willingly make sacrifices in their departments for the good of the team',
    dysfunction: 'Inattention to Results'
  },
  {
    question: 'Team members openly admit their weaknesses and mistakes',
    dysfunction: 'Absence of Trust'
  },
  {
    question: 'Team meetings are compelling, and not boring',
    dysfunction: 'Fear of Conflict'
  },
  {
    question: 'Team members leave meetings confident that peers are committed to team decisions',
    dysfunction: 'Lack of Commitment'
  },
  {
    question: 'Morale is significantly affected by failure to achieve team goals',
    dysfunction: 'Inattention to Results'
  },
  {
    question: 'During team meetings, the most important and difficult issues are put on the table',
    dysfunction: 'Fear of Conflict'
  },
  {
    question: 'Team members are deeply concerned about the prospect of letting down their peers',
    dysfunction: 'Avoidance of Accountability'
  },
  {
    question: 'Team members know about one another\'s personal lives and are comfortable discussing them',
    dysfunction: 'Absence of Trust'
  },
  {
    question: 'Team members end discussions with clear and specific resolutions and action items',
    dysfunction: 'Lack of Commitment'
  },
  {
    question: 'Team members challenge one another about their plans and approaches',
    dysfunction: 'Avoidance of Accountability'
  },
  {
    question: 'Team members are slow to seek credit for their own contributions and point out those of others',
    dysfunction: 'Inattention to Results'
  }
]

const score = {
  'always': 3,
  'sometimes': 2,
  'never': 1
}

module.exports = {

  questions: function() {
    return questions
  },

  summarise: function(results) {
    let summary
    if (results.length == 1) {
      summary = results[0]
    } else {
      let n = 0
      for (let i = 0; i < results.length; i++) {
        n = n + results[i]
      }
      summary = n / results.length
    }
    return summary
  }

}
