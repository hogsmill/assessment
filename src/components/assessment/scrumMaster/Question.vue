<template>
  <div class="scrum-master-question">
    <h3>
      {{ question.question.area }} - {{ question.question.subarea }}
    </h3>
    <h4>
      {{ question.question.title }}
      <i v-if="server.scope == 'organisation' && server.showTeamAnswers" class="fas fa-users" title="Show team answers" @click="showTeamAnswers()" />
    </h4>
    <div class="buttons">
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Tourist'].value}" @click="answer('Tourist')" @mouseover="setTitle(answers['Tourist'].title)" @mouseleave="setTitle('')" :title="answers['Tourist'].title">
        0 <br> <i class="label">(Tourist)</i>
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Starting'].value}" @click="answer('Starting')" @mouseover="setTitle(answers['Starting'].title)" @mouseleave="setTitle('')" :title="answers['Starting'].title">
        1 <br> <i class="label">(Starting)</i>
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Improving'].value}" @click="answer('Improving')" @mouseover="setTitle(answers['Improving'].title)" @mouseleave="setTitle('')" :title="answers['Improving'].title">
        2 <br> <i class="label">(Improving)</i>
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Steady'].value}" @click="answer('Steady')" @mouseover="setTitle(answers['Steady'].title)" @mouseleave="setTitle('')" :title="answers['Steady'].title">
        3 <br> <i class="label">(Steady)</i>
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Expert'].value}" @click="answer('Expert')" @mouseover="setTitle(answers['Expert'].title)" @mouseleave="setTitle('')" :title="answers['Expert'].title">
        4 <br> <i class="label">(Expert)</i>
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == answers['Master'].value}" @click="answer('Master')" @mouseover="setTitle(answers['Master'].title)" @mouseleave="setTitle('')" :title="answers['Master'].title">
        5 <br> <i class="label">(Master)</i>
      </button>
      <div id="sm-explanation" v-html="explanation" />
    </div>
  </div>
</template>

<script>
import bus from '../../../socket.js'

import assessmentFuns from '../../../lib/assessment.js'

export default {
  props: [
    'question'
  ],
  data() {
    return {
      showAnswers: false,
      allAnswers: [],
      explanation: '',
      answers: {
        'Tourist': {value: 0, title: 'Still don\'t know how to apply this or never heard of this' },
        'Starting': { value: 1, title: 'This is on my radar' },
        'Improving': { value: 2, title: 'On-progress but still needs much more of my attention' },
        'Steady': { value: 3, title: 'It\'s there but needs action to take it to the next level' },
        'Expert': { value: 4, title: 'This is on the right track. Just keep going' },
        'Master': { value: 5, title: 'Full maturity here, I don’t need to worry about it' }
      }
    }
  },
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  created() {
    bus.$on('loadQuestionAnswers', (data) => {
      console.log('loadQuestionAnswers', data)
      if (assessmentFuns.isThisAssessment(data.assessment, this.assessment)) {
        this.allAnswers = data.answers
      }
    })
  },
  methods: {
    setTitle(title) {
      console.log(title)
      this.explanation = title
    },
    answer(answer) {
      const answerValue = this.answers[answer].value
      bus.$emit('sendAnswerQuestion', {assessment: this.assessment, questionId: this.question.id, answer: answerValue})
    },
    showTeamAnswers() {
      bus.$emit('sendGetQuestionAnswers', {assessment: this.assessment, questionId: this.question.id})
      this.showAnswers = !this.showAnswers
    }
  }
}
</script>

<style lang="scss">
  .scrum-master-question {
    margin: auto auto;
    display: inline-block;
    position: relative;

    .fa-users {
      font-size: inherit !important;
    }

    h3 {
      .fas {
        font-size: inherit !important;
      }
    }

    h4 {
      height: 120px;
    }

    .question-answers {
      visibility: hidden;
      position: absolute;
      z-index: 10;
      top: 40px;
      left: 40%;
      border: 4px solid;
      padding: 8px;
      background-color: #fff;

      div {
        text-align: left;
      }
    }

    .buttons {
      margin: 24px;

      button {
        color: #fff;
        margin: 4px 8px;
        width: 100px;

        i {
          font-size: smaller;
        }

        &:hover {
          color: #f4511e !important;
          background-color: #fff !important;
        }

        &.selected {
          background-color: green;
          border-color: darkgreen;

          &:hover {
            background-color: #fff;
          }
        }
      }

      #sm-explanation {
        height: 24px;
        font-size: medium;
        font-style: italic;
      }
    }
  }
</style>
