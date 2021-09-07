
const questions = [

  // Servant Leadership
  // Team
  {
    title: 'Coaching the team members in self-management and cross-functionality',
    label: 'Coaching the Team',
    area: 'Servant Leadership',
    subarea: 'Serving the Team'
  },
  {
    title: 'Helping the Scrum Team focus on creating high-value Increments that meet the Definition of Done',
    label: 'Focus Team on Value',
    area: 'Servant Leadership',
    subarea: 'Serving the Team'
  },
  {
    title: 'Causing the removal of impediments to the Scrum Team’s progress',
    label: 'Removing impediments',
    area: 'Servant Leadership',
    subarea: 'Serving the Team'
  },
  {
    title: 'Ensuring that all Scrum events take place and are positive, productive, and kept within the time-box',
    label: 'Scrum events',
    area: 'Servant Leadership',
    subarea: 'Serving the Team'
  },

  // Product Owner
  {
    title: 'Helping find techniques for effective Product Goal definition and Product Backlog management',
    label: 'Goal definition and Backlog management',
    area: 'Servant Leadership',
    subarea: 'Serving the Product Owner'
  },
  {
    title: 'Helping the Scrum Team understand the need for clear and concise Product Backlog items',
    label: 'Backlog items',
    area: 'Servant Leadership',
    subarea: 'Serving the Product Owner'
  },
  {
    title: 'Helping establish empirical product planning for a complex environment',
    label: 'PO empiricism',
    area: 'Servant Leadership',
    subarea: 'Serving the Product Owner'
  },
  {
    title: 'Facilitating stakeholder collaboration as requested or needed',
    label: 'Stakeholder collaboration',
    area: 'Servant Leadership',
    subarea: 'Serving the Product Owner'
  },

  // Organisation
  {
    title: 'Leading, training, and coaching the organization in its Scrum adoption',
    label: 'Scrum adoption',
    area: 'Servant Leadership',
    subarea: 'Serving the Organisation'
  },
  {
    title: 'Planning and advising Scrum implementations within the organization',
    label: 'Scrum implementations',
    area: 'Servant Leadership',
    subarea: 'Serving the Organisation'
  },
  {
    title: 'Helping employees and stakeholders understand and enact an empirical approach for complex work',
    label: 'Stakeholder empiricism',
    area: 'Servant Leadership',
    subarea: 'Serving the Organisation'
  },
  {
    title: 'Removing barriers between stakeholders and Scrum Teams',
    label: 'Removing barriers',
    area: 'Servant Leadership',
    subarea: 'Serving the Organisation'
  },

  // Scrum Values
  {
    title: 'Being committed to serving the team and the organization. Being focused on the role of Scrum Master and the value it can deliver',
    label: 'Commitment and Focus',
    area: 'Scrum Values',
    subarea: 'Commitment and Focus'
  },
  {
    title: 'Fostering an atmosphere of respect and trust but also of openness. Guiding and helping the team as a true servant leader (and not as command-control manager)',
    label: 'Openness and Respect',
    area: 'Scrum Values',
    subarea: 'Openness and Respect'
  },
  {
    title: 'Helping the Scrum team to feel safe enough to say no, to ask for help, to try new things, challenge the status quo, and embrace uncertainty',
    label: 'Courage',
    area: 'Scrum Values',
    subarea: 'Courage'
  },

  // Pillars
  {
    title: 'The emergent process and work must be visible to those performing the work as well as those receiving the work. ', 
    more: 'Some positive signs about the application of transparency: helping to make the process and information visible, ' +
          'acting transparently towards your team even if it\' about failures or concerns, fostering transparency as a habit ' +
          ' and way of working, and making information easily accessible to everyone.',
    label: 'Transparency',
    area: 'Scrum Pillars',
    subarea: 'Transparency'
  },
  {
    title: 'The Scrum artifacts and the progress toward agreed goals must be inspected frequently and diligently to detect potentially undesirable variances or problems. ',
    more: 'Some positive signs about the application of inspection: Inspection is continuously done with the product development ' +
          '(i.e. sprint review) but it is also done in other aspects like processes, people, practices, etc. Inspection is frequent ' +
          'but it doesn’t get in the way',
    label: 'Inspection',
    area: 'Scrum Pillars',
    subarea: 'Inspection'
  },
  {
    title: 'If any aspects of a process deviate outside acceptable limits or if the resulting product is unacceptable, the process being applied or the materials being produced must be adjusted. ',
    more: 'Some positive signs about the application of adaptation: Things are constantly adjusted or changed. ' +
          'Improvements are happening constantly. Change is sustainable which means is constant but not disruptive.',
    label: 'Adaptation',
    area: 'Scrum Pillars',
    subarea: 'Adaptation'
  }
]

module.exports = {

  questions: function() {
    return questions
  }

}
