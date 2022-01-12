
const richemont = require('./teamHealthCheck/richemont')

const routes = {
  richemont: richemont
}

const questions = {
  'uk-english': [
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
      good: 'We get stuff done really quickly. No waiting, no delays',
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
      good: 'We are in control of our destiny! We decide what to build and how to build it.',
      bad: 'We are just pawns in a game of chess, with no influence over what we build or how we build it'
    }
  ],
  'french': [
    {
       title: 'Facile à livrer',
       good: 'Livrer se passe sans douleur. C’est simple, sécurisé, & presque entièrement automatisé',
       bad: 'Livrer est risqué, douloureux et interminable. Le travail est, dans l’ensemble, manuel.'
     },
     {
       title: 'Une organisation du travail ajustée',
       good: 'Notre manière de travailler nous va parfaitement',
       bad: 'Notre manière de travailler ne nous convient pas du tout'
     },
     {
       title: 'La qualité Technique (du code)',
       good: 'Nous sommes fier.es de la qualité de notre code! Il est propre, facile à lire et la couverture de test est large',
       bad: 'Notre code est de mauvaise qualité et on a perdu le contrôle de la dette technique'
     },
     {
       title: 'La Valeur',
       good: 'Nous livrons un résultat excellent! Nous en sommes fier.es et nos sponsors/clients/utilisateurs sont très contents',
       bad: 'Nous livrons de la m.... Nous avons honte de livrer. Nos sponsors/clients/utilisateurs nous détestent'
     },
     {
       title: 'La Vitesse',
       good: 'Nos temps de realization sont très courts. Pas d’attente, pas de délai',
       bad: 'Nous ne finissons jamais rien. Nous sommes sans arrêt bloqués ou interrompus. Les Stories sont sans arrêt bloquées par les dépendances'
     },
     {
       title: 'La Mission',
       good: 'Nous savons exactement pourquoi nous sommes là et nous en sommes vraiment ravi.es',
       bad: 'Nous n’avons aucune idée de pourquoi nous sommes là, il n’y a pas de vision de haut niveau. Notre mission n’en est pas une, elle n’est pas claire et ne nous inspire pas'
     },
     {
       title: 'Fun',
       good: 'Nous avons grand plaisir à aller travailler et prenons plaisir à travailler ensemble',
       bad: 'D’un mortel ennui'
     },
     {
       title: 'Apprendre',
       good: 'Nous apprenons tout le temps et c’est passionnant!',
       bad: 'Nous n’avons jamais le temps d’apprendre quoi que ce soit'
     },
     {
       title: 'Le Soutien',
       good: 'Nous avons tout le temps un très grand niveau de soutien et d’aide quand nous le demandons',
       bad: 'Nous restons bloqués sans arrêt parce que nous n’avons pas le soutien et l’aide que nous demandons'
     },
     {
       title: 'Acteur ou pion',
       good: 'Nous contrôlons notre destin. Nous décidons ce qu’il faut construire et comment le construire.',
       bad: 'Nous sommes de simples pions dans un échiquier, sans aucune influence sur ce que nous construisons ou sur comment le construire'
     }
  ]
}

module.exports = {

  questions: function(lang, route) {
    const qs = route ? routes[route].questions() : questions
    return qs[lang] ? qs[lang] : qs['uk-english']
  }

}
