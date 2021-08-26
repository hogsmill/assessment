
const questions = [
  {
    question: 'Team members are passionate and unguarded in their discussion of issues',
    dysfunction: {
      id: '93a45a1d-7aba-4021-a69e-d515dc2770f4',
      title: 'Fear of Conflict'
    }
  },
  {
    question: 'Team members call out one another\'s deficiencies or unproductive behaviours',
    dysfunction: {
      id: 'c8e214e6-59d4-4ac5-acc2-edfbfadd07b9',
      title: 'Avoidance of Accountability'
    }
  },
  {
    question: 'Team members know what their peers are working on and how they contribute to the team goals',
    dysfunction: {
      id: 'e6b2661a-213a-4b2b-9383-6ee0414411f1',
      title: 'Lack of Commitment'
    }
  },
  {
    question: 'Team members quickly and genuinely apologise if they do something damaging to the team',
    dysfunction: {
      id: '39554352-7405-44f9-a562-0975439e6e0a',
      title: 'Absence of Trust'
    }
  },
  {
    question: 'Team members willingly make sacrifices in their departments for the good of the team',
    dysfunction: {
      id: 'd5116a51-1cf5-450a-a507-5e85ccfc9c58',
      title: 'Inattention to Results'
    }
  },
  {
    question: 'Team members openly admit their weaknesses and mistakes',
    dysfunction: {
      id: '39554352-7405-44f9-a562-0975439e6e0a',
      title: 'Absence of Trust'
    }
  },
  {
    question: 'Team meetings are compelling, and not boring',
    dysfunction: {
      id: '93a45a1d-7aba-4021-a69e-d515dc2770f4',
      title: 'Fear of Conflict'
    }
  },
  {
    question: 'Team members leave meetings confident that peers are committed to team decisions',
    dysfunction: {
      id: 'e6b2661a-213a-4b2b-9383-6ee0414411f1',
      title: 'Lack of Commitment'
    }
  },
  {
    question: 'Morale is significantly affected by failure to achieve team goals',
    dysfunction: {
      id: 'd5116a51-1cf5-450a-a507-5e85ccfc9c58',
      title: 'Inattention to Results'
    }
  },
  {
    question: 'During team meetings, the most important and difficult issues are put on the table',
    dysfunction: {
      id: '93a45a1d-7aba-4021-a69e-d515dc2770f4',
      title: 'Fear of Conflict'
    }
  },
  {
    question: 'Team members are deeply concerned about the prospect of letting down their peers',
    dysfunction: {
      id: 'c8e214e6-59d4-4ac5-acc2-edfbfadd07b9',
      title: 'Avoidance of Accountability'
    }
  },
  {
    question: 'Team members know about one another\'s personal lives and are comfortable discussing them',
    dysfunction: {
      id: '39554352-7405-44f9-a562-0975439e6e0a',
      title: 'Absence of Trust'
    }
  },
  {
    question: 'Team members end discussions with clear and specific resolutions and action items',
    dysfunction: {
      id: 'e6b2661a-213a-4b2b-9383-6ee0414411f1',
      title: 'Lack of Commitment'
    }
  },
  {
    question: 'Team members challenge one another about their plans and approaches',
    dysfunction: {
      id: 'c8e214e6-59d4-4ac5-acc2-edfbfadd07b9',
      title: 'Avoidance of Accountability'
    }
  },
  {
    question: 'Team members are slow to seek credit for their own contributions and point out those of others',
    dysfunction: {
      id: 'd5116a51-1cf5-450a-a507-5e85ccfc9c58',
      title: 'Inattention to Results'
    }
  }
]

const score = {
  'always': 3,
  'sometimes': 2,
  'never': 1
}

function result(result, question) {
  const key = question.question.dysfunction.id
  if (!result[key]) {
    result[key] = score[question.answer]
  } else {
    result[key] = result[key] + score[question.answer]
  }
  return result
}

module.exports = {

  questions: function() {
    return questions
  },

  setResults: function(assessments) {
    const results = {}
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i]
      for (let i = 0; i < assessment.questions.length; i++) {
        const question = assessment.questions[i]
        if (!results[question.question.dysfunction.id]) {
          results[question.question.dysfunction.id] = {
            question: question.question.dysfunction.title,
            results: {}
            }
        }
      }
    }
    return results
  },

  assessmentResults: function(assessment, key, results) {
    const keys = Object.keys(results)
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i]
      for (let j = 0; j < assessment.questions.length; j++) {
        const question = assessment.questions[j]
        if (question.question.dysfunction.id == k) {
          if (!results[k].results[key]) {
            results[k].results[key] = []
          }
          results[k].results[key] = result(results[k].results[key], question)
        }
      }
      results[k].results[key] = {
        answer: results[k].results[key][k],
        comments: []
      }
    }
    return results
  }

}
