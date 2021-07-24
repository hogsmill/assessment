<template>
  <div class="five-dysfunctions-question">
    <div class="question-holder">
      <div class="question">
        {{ question.question.question }}
      </div>
    </div>
    <div class="buttons">
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'always'}" @click="answer('always')">
        Always
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'sometimes'}" @click="answer('sometimes')">
        Sometimes
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'never'}" @click="answer('never')">
        Never
      </button>
    </div>
  </div>
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'question'
  ],
  computed: {
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    answer(answer) {
      bus.$emit('sendAnswerQuestion', {assessment: this.assessment, questionId: this.question.id, answer: answer})
    }
  }
}
</script>

<style lang="scss">
  .five-dysfunctions-question {
    margin: auto auto;
    width: 500px;
    display: inline-block;

    .question-holder {
      height: 120px;
      display: table-cell;
      vertical-align: middle;
    }

    .buttons {
      margin: 24px;

      button {
        margin: 4px 8px;
        width: 100px;

        &.selected {
          background-color: green;
          border-color: darkgreen;

          &:hover {
            color: #fff;
          }
        }
      }
    }
  }
</style>
