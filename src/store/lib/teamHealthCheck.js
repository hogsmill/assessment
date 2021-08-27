
const questions = [
  {
    title: 'Easy to Release',
    good: 'Releasing is simple, safe, painless & mostly automated',
    bad: 'Releasing is risky, painful, lots of manual work, and takes forever'
  },
  {
    title: 'Suitable process',
    good: 'Our way of working fits us perfectly',
    bad: 'Our way of working sucks'
  },
  {
    title: 'Tech quality (code base health)',
    good: 'We\'re proud of the quality of our code! It is clean, easy to read, and has great test coverage',
    bad: 'Our code is a pile of dung, and technical debt is raging out of control'
  },
  {
    title: 'Value',
    good: 'We deliver great stuff! We’re proud of it and our stakeholders are really happy',
    bad: 'We deliver crap. We feel ashamed to deliver it. Our stakeholders hate us'
  },
  {
    title: 'Speed',
    good: 'We get stuff done really quickly.No waiting, no delays',
    bad: 'We never seem to get done with anything. We keep getting stuck or interrupted. Stories keep getting stuck on dependencies'
  },
  {
    title: 'Mission',
    good: 'We know exactly why we are here, and we are really excited about it',
    bad: 'We have no idea why we are here, there is no high level picture or focus. Our so-called mission is completely unclear and uninspiring'
  },
  {
    title: 'Fun',
    good: 'We love going to work, and have great fun working together',
    bad: 'Boooooooring'
  },
  {
    title: 'Learning',
    good: 'We\'re learning lots of interesting stuff all the time!',
    bad: 'We never have time to learn anything'
  },
  {
    title: 'Support',
    good: 'We always get great support and help when we ask for it',
    bad: 'We keep getting stuck because we can\'t get the support and help that we ask for'
  },
  {
    title: 'Pawns or players',
    good: 'We are in control of our destiny!',
    bad: 'We decide what to build and how to build it. We are just pawns in a game of chess, with no influence over what we build or how we build it'
  }
]

module.exports = {

  questions: function() {
    return questions
  },

  setResults: function(assessments, appType) {
    const results = {}
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i]
      for (let j = 0; j < assessment.questions.length; j++) {
        const question = assessment.questions[j]
        if (!results[question.id]) {
          results[question.id] = {
            question: question.question.title,
            results: {}
          }
        }
      }
    }
    return results
  },

  assessmentResults: function(assessment, key, results) {
    for (let i = 0; i < assessment.questions.length; i++) {
      question = assessment.questions[i]
      results[question.id].results[key] = {answer: question.answer}
      const comments = results[question.id].results[key].comments ? results[question.id].results[key].comments : []
      if (question.comments) {
        for (let k = 0; k < question.comments.length; k++) {
          comments.push(question.comments[k])
        }
        results[question.id].results[key].comments = comments
      }
    }
    return results
  }

}
