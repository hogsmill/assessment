
const questions = [
  {
    title: 'Visualization',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'Team does not have a collective visualization of the work being done'},
      2: {level: 'Emerging', description: 'The team is visualizing all work but in different locations'},
      3: {level: 'Operating', description: 'The team can collectively visualize all their work in one place and has an up-to-date team board'},
      4: {level: 'Adaptive', description: 'The team has visibility into the work and knows the business value of each item'},
      5: {level: 'Innovative', description: 'There is always a clear, concise backlog prioritized by business value'}
    }
  },
  {
    title: 'Prioritization',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'Team works items as they come in or according to SLA or due date'},
      2: {level: 'Emerging', description: 'The team has a method for prioritizing work but often works ad hoc, unplanned requests as first in first out (shoulder-tap, email, etc.) on a regular basis'},
      3: {level: 'Operating', description: 'The team is working from a prioritized list and is moving away from first in first out response to unplanned work, starting to work it into the backlog'},
      4: {level: 'Adaptive', description: 'The team is prioritizing most work by value and rarely works unplanned items that have not been prioritized'},
      5: {level: 'Innovative', description: 'The team is working items from only from a prioritized list, and has a system for managing break/fix work that enables them to quickly pivot without disrupting delivery of planned  work'}
    }
  },
  {
    title: 'Continuous Improvement',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'The team does not have a retrospective each sprint'},
      2: {level: 'Emerging', description: 'The team has a retrospective each sprint, but action is not always taken to implement continuous improvement items'},
      3: {level: 'Operating', description: 'The team identifies action items for improvement during the retrospective and prioritizes the identified actions(actions are not constantly pushed aside due to competing priorities with work requests)'},
      4: {level: 'Adaptive', description: 'The team works a continuous improvement item through to completion at least every sprint'},
      5: {level: 'Innovative', description: 'The team owns their own continuous improvement plan and is consistently prioritizing and implementing improvements'}
    }
  },
  {
    title: 'Predictability',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'The team is not making sprint commitments and/or is not estimating work'},
      2: {level: 'Emerging', description: 'The team is frequently missing sprint commitments and/or is frequently over or under estimating work'},
      3: {level: 'Operating', description: 'The team is consistently meeting sprint commitments and is accurate when estimating'},
      4: {level: 'Adaptive', description: 'The team is using velocity or other previous perfomance measures to make predictions on delivery'},
      5: {level: 'Innovative', description: 'The team has reached a consistent delivery pace where they are able to deliver value often while providing accurate estimations to the customer'}
    }
  },
  {
    title: 'Collaboration',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'The team is not collaborating with the customer consistently each sprint even though there are opportunities to do so'},
      2: {level: 'Emerging', description: 'The team collaborates with customers at the end of the sprint or after the sprint has ended rather than during the sprint'},
      3: {level: 'Operating', description: 'The team is collaborating with the customer during the sprint and only occasionally misses opportunities to do so'},
      4: {level: 'Adaptive', description: 'The team is collaborating with customers frequently throughout the sprint on all work items where there are opportunities to do so'},
      5: {level: 'Innovative', description: 'The team is collaboratingw ith the customers throughout the sprint on all necessary work items and has built a trusted relationship'}
    }
  },
  {
    title: 'Framework',
    area: 'Principles',
    levels: {
      1: {level: 'Developing', description: 'The team is not utilizing all ceremonies in the framework'},
      2: {level: 'Emerging', description: 'The team is utilizing all ceremonies in the framework, but does not feel all ceremonies are necessary'},
      3: {level: 'Operating', description: 'The team utilizes all ceremonies in the framework and understands the value of the ceremonies but may not be gaining value from them all'},
      4: {level: 'Adaptive', description: 'The team is gaining the intended value from all ceremonies each iteration'},
      5: {level: 'Innovative', description: 'The team owns planning, stand up, the review and retro, they happen organically and no longer need formal facilitation by a coach or scrum master. The team is maximizing the value of these ceremonies'}
    }
  },
  {
    title: 'Teamwork',
    area: 'Team Dynamics',
    levels: {
      1: {level: 'Developing', description: 'We are a bunch of individuals that neither know about nor care about what the other people in the team are doing'},
      2: {level: 'Emerging', description: 'Some people show interest in what other team members are doing but others still work in a silo'},
      3: {level: 'Operating', description: 'We collaborate on work but succeed as individuals'},
      4: {level: 'Adaptive', description: 'We collaborate on work, knowing that we succeed as a team and step in where we are needed to help meet goals'},
      5: {level: 'Innovative', description: 'We all have the same goals and are a cross-functional team that collaborates without formal facilitation to complete all work'}
    }
  },
  {
    title: 'Trust',
    area: 'Team Dynamics',
    levels: {
      1: {level: 'Developing', description: 'We are paranoid and not willing to share with each other'},
      2: {level: 'Emerging', description: 'We trust that each team member will complete their own work but are not willing to allow others to do our work'},
      3: {level: 'Operating', description: 'We trust each other and are starting to teach each other to do work that they previously could not do'},
      4: {level: 'Adaptive', description: 'We share knowledge and trust each team member to pick up pieces of work they are trained on, asking for help when  needed'},
      5: {level: 'Innovative', description: 'We completely trust each other to do the right thing and anyone can pick up any piece of work'}
    }
  },
  {
    title: 'Work Balance/Satisfaction',
    area: 'Team Dynamics',
    levels: {
      1: {level: 'Developing', description: 'Team members feel overwhelmed and overworked'},
      2: {level: 'Emerging', description: 'The team is bringing visibility to capacity issues and is starting to resolve them'},
      3: {level: 'Operating', description: 'The team is able to work at a sustainable pace some of the time'},
      4: {level: 'Adaptive', description: 'The team works at a sustainable pace consistently and has opportunities to work on new things'},
      5: {level: 'Innovative', description: 'The team feels engaged daily and has opportunities to be innovative and introduce new ideas'}
    }
  },
  {
    title: 'Quality',
    area: 'Technical Processes',
    levels: {
      1: {level: 'Developing', description: 'The team is not discussing quality concerns and/or does not measure  quality. Majority of testing is done manually'},
      2: {level: 'Emerging', description: 'The team has defined quality standards and measurements. Compliance is monitored through a manual but consistent process'},
      3: {level: 'Operating', description: 'Comprehensive quality standards are defined. Compliance is enforced through a combination of manual and automated  processes'},
      4: {level: 'Adaptive', description: 'Comprehensive quality standards are defined. Compliance is enforced through fully automated processes'},
      5: {level: 'Innovative', description: 'The team actively experiments with new methodologies and practices to increase quality and is using metrics to proactively address issues'}
    }
  },
  {
    title: 'Technical Debt',
    area: 'Technical Processes',
    levels: {
      1: {level: 'Developing', description: 'The team continues to acquire technical debt and is not  taking action to resolve it'},
      2: {level: 'Emerging', description: 'The team is starting to document and prioritize technical debt but not taking action to stop acquiring it'},
      3: {level: 'Operating', description: 'The team has an active technical debt backlog that is  prioritized and worked and are starting to use better design practices to limit the amount of tech debt created'},
      4: {level: 'Adaptive', description: 'The team has little technical debt due to past decisions and regularly uses good design practices to avoid creating more'},
      5: {level: 'Innovative', description: 'The team only acquires technical debt when it is deliberate  and immediately develops a plan to resolve it'}
    }
  },
  {
    title: 'Definition of Done',
    area: 'Technical Processes',
    levels: {
      1: {level: 'Developing', description: 'The team does not have a visible agreed upon Definition of Done for any level of work'},
      2: {level: 'Emerging', description: 'The team has a Definition of Done but does not enforce it'},
      3: {level: 'Operating', description: 'The team has a Definition of Done that is applied to all work'},
      4: {level: 'Adaptive', description: 'The team has an evolving definition of done that is applied to all work'},
      5: {level: 'Innovative', description: 'The team has a definition of done at a story levelthat is evolving and advancing the team toward continuous deployment(and/or story level release activities where  deployment is not involved)'}
    }
  },
  {
    title: 'Simplicity',
    area: 'Technical Processes',
    levels: {
      1: {level: 'Developing', description: 'Big up-front design and significant investment in building up front frameworks - "Kitchen-Sink"'},
      2: {level: 'Emerging', description: 'Looking for ways to simplify architecture, testing, development but it is not the standard approach'},
      3: {level: 'Operating', description: 'Using the YAGNI* practice when approaching new work and have a backlog of opportunities to simplify existing code/configurations'},
      4: {level: 'Adaptive', description: 'Able to defer design decisions which may be required by a future requirement, team sets aside enough time to regularly address issues with complexity'},
      5: {level: 'Innovative', description: 'Just-in-time design, established needs, no duplication, no gold-plating, fewest moving parts'}
    }
  },
  {
    title: 'IT Leadership Support',
    area: 'Organizational Dynamics',
    levels: {
      1: {level: 'Developing', description: 'IT leadership does not actively support agile principles and practices'},
      2: {level: 'Emerging', description: 'IT leadership supports some agile principles and practices'},
      3: {level: 'Operating', description: 'There is clear, visible support from IT leadership regarding most agile principles and practices'},
      4: {level: 'Adaptive', description: 'IT leadership actively supports agile principles and practices and is supporting organizational agile transformation initiatives'},
      5: {level: 'Innovative', description: 'IT leadership has implemented agile principles and practices. Being agile is ingrained in the culture'}
    }
  },
  {
    title: 'Resourcing',
    area: 'Organizational Dynamics',
    levels: {
      1: {level: 'Developing', description: 'People are dedicated to multiple initiatives with multiple  teams or projects'},
      2: {level: 'Emerging', description: 'Long lived cross functional teams are starting to be formed but team members are often pulled into other projects/work'},
      3: {level: 'Operating', description: 'Long lived cross functional teams are starting to be formed and team members are rarely pulled into other projects/work'},
      4: {level: 'Adaptive', description: 'There are multiple long lived cross functional teams that are 100% dedicated to a backlog of work'},
      5: {level: 'Innovative', description: 'Resources are dedicated and aligned to business outcomes - silos do not exist'}
    }
  },
  {
    title: 'Customer  Support',
    area: 'Organizational Dynamics',
    levels: {
      1: {level: 'Developing', description: 'The customer is not responsive to requests for support or testing'},
      2: {level: 'Emerging', description: 'The customer responds to requests for support or testing but it\'s usually delayed'},
      3: {level: 'Operating', description: 'The customer responds in a timely manner to most requests for support or testing'},
      4: {level: 'Adaptive', description: 'The customer is consistently available to the team when needed'},
      5: {level: 'Innovative', description: 'The customer acts as part of the team and is proactively supporting the team in any way possible'}
    }
  },
  {
    title: 'Business Value',
    area: 'Organizational Dynamics',
    levels: {
      1: {level: 'Developing', description: 'We do not have visibility into the goals of our business customers'},
      2: {level: 'Emerging', description: 'We have visibility into the goals of our business customers, but we do not understand them'},
      3: {level: 'Operating', description: 'Key business customers agree on goals, but they often do not translate to the work that is being done'},
      4: {level: 'Adaptive', description: 'Key business customers agree on goals and the priority of work'},
      5: {level: 'Innovative', description: 'Key business customers agree on goals and the priority of work and the business iteratively reviews the goals with us to ensure work is aligned to business value'}
    }
  },
  {
    title: 'Project Management',
    area: 'Organizational Dynamics',
    levels: {
      1: {level: 'Developing', description: 'Project schedules act as a plan. Fixed planning and maximum resource utilization. Feature completion is a milestone. Risk reactive – re-planning due to interruptions or emergencies'},
      2: {level: 'Emerging', description: 'Release or Iteration milestones: Time, rather than feature ompletion determines the project schedule. Scope is rarely negotiable, but implementation of that scope is'},
      3: {level: 'Operating', description: 'Release milestones are based on up to date baselines using empirical process control (observations and experience). Scope and time are negotiated with business partner as new information emerges'},
      4: {level: 'Adaptive', description: 'Iterations provide consistent measurement. Stories are constantly re-prioritized in a collaborative effort with the business partner based on user feedback, development experience, and other factors'},
      5: {level: 'Innovative', description: 'Dynamic portfolio planning, maximizing business impact. Continuous portfolio rebalancing that informs and is informed by project status  and performance'}
    }
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
      results[question.id].results[key] = question.answer
      if (!results[question.id].comments) {
        results[question.id].comments = {}
      }
      const comments = results[question.id].comments[key] ? results[question.id].comments[key] : []
      if (question.comments) {
        for (let k = 0; k < question.comments.length; k++) {
          comments.push(question.comments[k])
        }
        results[question.id].comments[key] = comments
      }
    }
    return results
  }

}
