<template>
  <div v-if="assessment.questions" class="questions">
    <div v-for="(question, index) in assessment.questions" :key="index" class="question-block">
      <div v-if="question.order == order">
        <div class="prev" v-if="!server.autoNextQuestion">
          <i v-if="order > 1" class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
        </div>
        <Question5Dysfunctions v-if="appType == '5 Dysfunctions'" :question="question" />
        <QuestionTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
        <div class="next" v-if="!server.autoNextQuestion">
          <i v-if="question.answer && order < assessment.questions.length" class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
          <i v-if="question.answer && order == assessment.questions.length" class="fas fa-poll-h" title="Go to Results" @click="goToResults()" />
        </div>
      </div>
    </div>
    <div v-if="server.autoNextQuestion && order > assessment.questions.length">
      <button class="btn btn-info" @click="goToResults()">
        Go To Results
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

import assessmentFuns from '../../lib/assessment.js'

import Question5Dysfunctions from './fiveDysfunctions/Question.vue'
import QuestionTeamHealthCheck from './teamHealthCheck/Question.vue'

export default {
  components: {
    Question5Dysfunctions,
    QuestionTeamHealthCheck
  },
  data() {
    return {
      order: 1
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    server() {
      return this.$store.getters.getServer
    },
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  created() {
    bus.$on('answerQuestion', (data) => {
      if (assessmentFuns.isThisAssessment(data.assessment, this.assessment)) {
        this.answer(data)
      }
    })
  },
  methods: {
    prev() {
      this.order = this.order - 1
    },
    next() {
      this.order = this.order + 1
    },
    answer(data) {
      bus.$emit('sendSetAnswer', {assessment: this.assessment, questionId: data.questionId, answer: data.answer})
      if (this.server.autoNextQuestion) {
        this.next()
      }
    },
    goToResults() {
      if (this.server.autoNextQuestion || confirm('Complete the assessment?')) {
        if (this.server.scope == 'individual') {
          this.$store.dispatch('updateState', 'results')
        } else {
          this.$store.dispatch('updateCurrentTab', 'results')
        }
      }
    }
  }
}
</script>

<style lang="scss">
  .questions {
    margin-top: 24px;
    font-size: x-large;

    .question-block {
      margin: 0 auto;
      text-align: center;

      .fas {
        font-size: xxx-large;
        color: #aaa;

        &:hover {
          color: #444;
        }
      }

      .far {
        font-size: xxx-large;
        color: #fff;
      }

      .prev, .next {
        margin: auto auto;
        width: 100px;
        display: inline-block;
      }
    }
  }
</style>
