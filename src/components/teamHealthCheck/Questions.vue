<template>
  <div class="team-health-check-questions">
    <div v-for="(question, index) in questions" :key="index" class="question-block">
      <div v-if="question.order == order">
        <div class="prev">
          <i v-if="order > 1" class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
        </div>
        <div class="question">
          <h3>
            {{ question.title }}
          </h3>
          <div>
            {{ question.good }}
          </div>
          <div>
            {{ question.bad }}
          </div>
          <div class="buttons">
            <button class="btn btn-info" :class="{ 'selected': question.answer == 'red'}" @click="answer(question.id, 'red')">
              Red
            </button>
            <button class="btn btn-info" :class="{ 'selected': question.answer == 'amber'}" @click="answer(question.id, 'amber')">
              Amber
            </button>
            <button class="btn btn-info" :class="{ 'selected': question.answer == 'green'}" @click="answer(question.id, 'green')">
              Green
            </button>
          </div>
        </div>
        <div class="next">
          <i v-if="order < questions.length" class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  data() {
    return {
      order: 1
    }
  },
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    }
  },
  methods: {
    prev() {
      this.order = this.order - 1
    },
    next() {
      this.order = this.order + 1
    },
    answer(id, answer) {
      bus.$emit('sendSetAnswer', {id: id, answer: answer})
    }
  }
}
</script>

<style lang="scss">
  .team-health-check-questions {
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

      .prev, .next {
        margin: auto auto;
        width: 100px;
        display: inline-block;
      }
      .question {
        margin: auto auto;
        width: 500px;
        display: inline-block;

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
    }
  }
</style>
