<template>
  <div class="questions">
    <div v-for="(question, index) in assessment.questions" :key="index" class="question-block">
      <div v-if="question.order == order">
        <div class="prev">
          <i v-if="order > 1" class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
        </div>
        <Question5Dysfunctions v-if="appType == '5 Dysfunctions'" :question="question" />
        <QuestionTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
        <div class="next">
          <i v-if="order < assessment.questions.length" class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
          <i v-if="order == assessment.questions.length" class="fas fa-poll-h" title="Go to Results" @click="setState('results')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

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
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    prev() {
      this.order = this.order - 1
    },
    next() {
      this.order = this.order + 1
    },
    setState(state) {
      if (confirm('Complete the assessment?')) {
        this.$store.dispatch('updateState', 'results')
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
