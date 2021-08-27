
module.exports = {

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

  assessmentResults: function(assessment, key, results, by) {
    for (let i = 0; i < assessment.questions.length; i++) {
      question = assessment.questions[i]
      results[question.id].results[key] = {answer: question.answer}
      const comments = results[question.id].results[key].comments ? results[question.id].results[key].comments : []
      if (question.comments) {
        for (let k = 0; k < question.comments.length; k++) {
          comments.push({
            comment: question.comments[k],
            by: by
          })
        }
        results[question.id].results[key].comments = comments
      }
    }
    return results
  }

}
