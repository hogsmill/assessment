<template>
  <div class="team-health-check-question">
    <h3>
      {{ question.question.title }}
      <i v-if="server.scope == 'organisation' && server.showTeamAnswers" class="fas fa-users" title="Show team answers" @click="showTeamAnswers()" />
    </h3>
    <div class="question-answers" :class="{'visible': showAnswers}">
      <div>
        All Answers:
        <i v-for="(ans, index) in allAnswers" :key="index" class="far" :class="answerClass(ans)" />
      </div>
    </div>
    <table>
      <tr>
        <td>
          <div class="traffic-light green" />
        </td>
        <td>
          {{ question.question.good }}
        </td>
      </tr>
      <tr>
        <td>
          <div class="traffic-light red" />
        </td>
        <td>
          {{ question.question.bad }}
        </td>
      </tr>
    </table>
    <div class="buttons">
      <button class="btn btn-info red" :class="{ 'selected': question.answer == answers['red']}" @click="answer('red')">
        <i class="far fa-frown" />
      </button>
      <button class="btn btn-info amber" :class="{ 'selected': question.answer == answers['amber']}" @click="answer('amber')">
        <i class="far fa-meh" />
      </button>
      <button class="btn btn-info green" :class="{ 'selected': question.answer == answers['green']}" @click="answer('green')">
        <i class="far fa-smile-beam" />
      </button>
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
      answers: {
        'red': 0,
        'amber': 1,
        'green': 2
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
      if (assessmentFuns.isThisAssessment(data, this.assessment)) {
        this.answers = data.answers
      }
    })
  },
  methods: {
    answerClass(answer) {
      let ansClass = ''
      switch(answer) {
        case 0:
          ansClass = 'fa-frown red'
          break
        case 1:
          ansClass = 'fa-meh amber'
          break
        case 2:
          ansClass = 'fa-smile-beam green'
          break
      }
      return ansClass
    },
    answer(answer) {
      const answerValue = this.answers[answer]
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
  .team-health-check-question {
    margin: auto auto;
    width: 600px;
    display: inline-block;
    position: relative;

    h3 {
      .fas {
        font-size: inherit !important;
      }
    }

    .question-answers {
      visibility: hidden;
      position: absolute;
      z-index: 10;
      width: 100%;
      top: 40px;

      div {
        margin: auto;
        border: 1px solid;
        padding: 3px;
        background-color: #fff;
      }

      i {
        width: 30px;
        height: 20px;
        border-radius: 4px;
        margin: 6px;
        color: #fff;
        font-size: small !important;
        padding: 3px;

        &.red {
          background-color: red;
        }
        &.amber {
          background-color: darkorange;
        }
        &.green {
          background-color: green;
        }
      }
    }

    .traffic-light {
      height: 150px;
      width: 100px;
      background-size: contain;
      background-repeat: no-repeat;
      background-position-x: center;
      margin: 12px;

      &.red {
        background-image: url("../../../assets/img/red-light.png");
      }

      &.green {
        background-image: url("../../../assets/img/green-light.png");
      }
    }

    .buttons {
      margin: 24px;

      button {
        color: #fff;
        margin: 4px 8px;
        width: 100px;
        border: 4px solid #fff;

        &.red {
          background-color: red;

          &.selected {
            border-color: red;

            i {
              color: red;
            }
          }
        }

        &.amber {
          background-color: orange;

          &.selected {
            border-color: orange;

            i {
              color: orange;
            }
          }
        }

        &.green {
          background-color: darkgreen;

          &.selected {
            border-color: darkgreen;

            i {
              color: darkgreen;
            }
          }
        }

        &.selected {
          background-color: #fff;
        }
      }
    }
  }
</style>
