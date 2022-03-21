<template>
  <div v-if="questionInclude(result.id)" class="result">
    <div class="question">
      {{ result.question }}
      <input v-if="server.scope == 'organisation'" type="checkbox" :checked="questionInclude(result.id)" @click="toggleInclude(result.id)" :title="'Include \'' + result.question + '\''">
    </div>
    <div class="answer">
      <div v-for="(res, index) in Object.keys(result.results)" :key="index" class="answer-header">
        <div class="answer-holder" :class="answerClass[result.results[res].answer]">
          {{ result.results[res].answer }}
          <i v-if="result.results[res].comments.length" class="far fa-comment"
             :title="'Comments for ' + result.question + ' from ' + res"
             @click="showComments(result.results[res], result.question + ' from ' + res)"
          />
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
  data() {
    return {
      answerClass: {
        0: 'nought',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four',
        5: 'five'
      }
    }
  },
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    questionsInclude() {
      return this.$store.getters.getQuestionsInclude
    }
  },
  methods: {
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
      bus.emit('sendShowQuestionComments', {comments: question.comments, title: title})
    },
    questionInclude(id) {
      const include = this.questionsInclude.find((q) => {
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
        width: 25%;
        text-align: right;
      }

      &.answer {
        width: 75%;
        text-align: left;

        .answer-holder {
          width: 60px;
          height: 36px;
          border-radius: 8px;
          margin: 4px 0 4px 12px;
          color: #fff;
          text-align: center;
          position: relative;

          &.nought {
            background-color: red;
          }

          &.one {
            background-color: #c0392b;
          }

          &.two {
            background-color: #d35400;
          }

          &.three {
            background-color: orange;
          }

          &.four {
            background-color: seagreen;
          }

          &.five {
            background-color: green;
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
