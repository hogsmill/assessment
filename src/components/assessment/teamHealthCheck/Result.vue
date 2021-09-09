<template>
  <div v-if="questionInclude(result.id)" class="result">
    <div class="question">
      {{ result.question }}
      <input type="checkbox" :checked="questionInclude(result.id)" @click="toggleInclude(result.id)" :title="'Include \'' + result.question + '\''">
    </div>
    <div class="answer">
      <div v-for="(res, index) in Object.keys(result.results)" :key="index" class="answer-header">
        <div class="answer-holder" :class="answerValue(result.results[res].answer)">
          <i v-if="scope.member == 'individual'" class="far" :class="answerClass(result.results[res].answer)" />
          <span v-if="scope.member != 'individual'">
            {{ formatAnswerValue(result.results[res].answer) }}
          </span>
          <i v-if="result.results[res].comments.length" class="far fa-comment"
             :title="'Comments for ' + result.question + ' from ' + res"
             @click="showComments(result.results[res], result.question + ' from ' + res)" />
        </div>
        <i v-if="index > 0" class="fas trend" :class="trendClass(index)" />
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'result',
    'scope'
  ],
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    questionsInclude() {
      return this.$store.getters.getQuestionsInclude
    }
  },
  methods: {
    answerValue(answer) {
      let answerValue = ''
      if (this.scope.member == 'individual') {
        switch(answer) {
          case 0:
            answerValue = 'red'
            break
          case 1:
            answerValue = 'amber'
            break
          case 2:
            answerValue = 'green'
            break
        }
      } else {
        if (answer < 0.66) {
          answerValue = 'red'
        } else if (answer < 1.33) {
          answerValue = 'amber'
        } else {
          answerValue = 'green'
        }
      }
      return answerValue
    },
    answerClass(answer) {
      let ansClass = ''
      switch(this.answerValue(answer)) {
        case 'red':
          ansClass = 'fa-frown'
          break
        case 'amber':
          ansClass = 'fa-meh'
          break
        case 'green':
          ansClass = 'fa-smile-beam'
          break
      }
      return ansClass
    },
    formatAnswerValue(val) {
      return Math.floor(val * 10) / 10
    },
    trendClass(index) {
      let trend
      const keys = Object.keys(this.result.results)
      const thisResult = this.result.results[keys[index]].answer
      const prevResult = this.result.results[keys[index - 1]].answer
      if (thisResult > prevResult) {
        trend = 'fa-long-arrow-alt-up'
      } else if (thisResult < prevResult) {
        trend = 'fa-long-arrow-alt-down'
      } else {
        trend = 'fa-arrows-alt-h'
      }
      return trend
    },
    showComments(question, title) {
      bus.$emit('sendShowQuestionComments', {comments: question.comments, title: title})
    },
    questionInclude(id) {
      const include this.questionsInclude.find((q) => {
        return q.id == id
      })
      return include ? include.include : true
    },
    toggleInclude(id) {
      this.$store.dispatch('toggleInclude', {id: id})
    }
  }
}
</script>

<style lang="scss">
  .result {
    margin: 0 auto;
    font-size: x-large;

    div {
      display: inline-block;

      &.question {
        width: 50%;
        text-align: right;
      }

      &.answer {
        width: 50%;
        text-align: left;

        .answer-holder {
          width: 60px;
          height: 36px;
          border-radius: 8px;
          margin: 4px 0 4px 12px;
          color: #fff;
          text-align: center;
          position: relative;

          &.red {
            background-color: red;
          }

          &.amber {
            background-color: orange;
          }

          &.green {
            background-color: darkgreen;
          }

          .fa-comment {
            position: absolute;
            top: -4px;
            right: -3px;
            color: #aaa;
            font-size: medium;

            &:hover {
              cursor: pointer;
            }
          }
        }

        .trend {
          margin-left: 2px;
          width: 30px;

          &.fa-long-arrow-alt-up {
            color: green;
          }

          &.fa-arrows-alt-h {
            color: grey;
          }

          &.fa-long-arrow-alt-down {
            color: red;
          }
        }
      }
    }
  }
</style>
