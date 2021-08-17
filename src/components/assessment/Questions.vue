<template>
  <div v-if="assessment.questions" class="questions">
    <WhosAnswered v-if="admin && server.hostMovesSlides && server.scope == 'organisation'" />
    <div v-for="(question, index) in assessment.questions" :key="index" class="question-block">
      <div v-if="question.order == order">
        <div class="prev" v-if="!server.autoNextQuestion">
          <i v-if="order > 1" class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
        </div>
        <Question5Dysfunctions v-if="appType == '5 Dysfunctions'" :question="question" />
        <QuestionTeamHealthCheck v-if="appType == 'Team Health Check'" :question="question" />
        <div class="next" v-if="!server.autoNextQuestion && !server.hostMovesSlides">
          <i v-if="answered(question) && order < assessment.questions.length" class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
          <i v-if="answered(question) && order == assessment.questions.length" class="fas fa-poll-h" title="Go to Results" @click="goToResults()" />
        </div>
        <div>
          <i v-if="!question.comments.length" class="far fa-comment" title="Click to comment." @click="show(question)" />
          <i v-if="question.comments.length" class="fas fa-comment" title="There are comments..." @click="show(question)" />
        </div>
      </div>
    </div>
    <div v-if="server.autoNextQuestion && order > assessment.questions.length">
      <button class="btn btn-info" @click="goToResults()">
        Go To Results
      </button>
    </div>

    <modal name="comment" :height="350" :classes="['rounded', 'comment']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4">
        <h4>
          Comment on
        </h4>
        <p class="comment-p">
          {{ questionText }}
        </p>
        <div class="comment-form">
          <textarea id="comment" rows="6" class="form-control" placeholder="Your comment" />
          <button class="btn btn-sm btn-secondary smaller-font" @click="saveComment()">
            Save Comment
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import bus from '../../socket.js'

import assessmentFuns from '../../lib/assessment.js'

import WhosAnswered from './WhosAnswered.vue'
import Question5Dysfunctions from './fiveDysfunctions/Question.vue'
import QuestionTeamHealthCheck from './teamHealthCheck/Question.vue'

export default {
  components: {
    WhosAnswered,
    Question5Dysfunctions,
    QuestionTeamHealthCheck
  },
  data() {
    return {
      order: 1,
      questionId: '',
      questionText: ''
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    admin() {
      return this.$store.getters.getAdmin
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

    bus.$on('nextQuestion', (data) => {
      if (assessmentFuns.isThisAssessment(data.assessment, this.assessment)) {
        this.next()
      }
    })

    bus.$on('goToResults', (data) => {
      if (assessmentFuns.isThisAssessment(data.assessment, this.assessment)) {
        this.goToResults()
      }
    })
  },
  methods: {
    show(question) {
      this.questionId = question.id
      this.questionText = question.question.title ? question.question.title : question.question.question
      this.$modal.show('comment')
    },
    hide() {
      this.questionId = ''
      this.$modal.hide('comment')
    },
    saveComment() {
      const comment = document.getElementById('comment').value
      bus.$emit('sendSaveComment', {assessment: this.assessment, questionId: this.questionId, comment: comment})
      this.hide()
    },
    prev() {
      this.order = this.order - 1
    },
    next() {
      this.order = this.order + 1
    },
    answered(question) {
      return question.answer != null
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

        &.fa-comment {
          color: #f4511e;
        }

        &:hover {
          color: #444;
        }
      }

      .far {
        font-size: xxx-large;
        color: #fff;
      }

      .fa-comment {
        color: #ccc;

        &:hover {
          cursor: pointer;
        }
      }

      .prev, .next {
        margin: auto auto;
        width: 100px;
        display: inline-block;
      }
    }
  }

  .comment-form {
    padding: 24px;
  }

  .comment-p {
    font-size: medium;
    text-align: center;
  }
</style>
