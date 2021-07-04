<template>
  <div class="team-health-check-questions">
    <div v-for="(question, index) in questions" :key="index" class="question-block">
      <div v-if="question.order == order">
        <div class="prev">
          <i v-if="order > 1" class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
        </div>
        <div class="question">
          <h3>
            {{ question.question.title }}
          </h3>
          <div class="good">
            {{ question.question.good }}
          </div>
          <div class="bad">
            {{ question.question.bad }}
          </div>
          <div class="buttons">
            <button class="btn btn-info red" :class="{ 'selected': question.answer == 'red'}" @click="answer(question.id, 'red')">
              <i class="far fa-frown" />
            </button>
            <button class="btn btn-info amber" :class="{ 'selected': question.answer == 'amber'}" @click="answer(question.id, 'amber')">
              <i class="far fa-meh" />
            </button>
            <button class="btn btn-info green" :class="{ 'selected': question.answer == 'green'}" @click="answer(question.id, 'green')">
              <i class="far fa-smile-beam" />
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

      .far {
        font-size: xxx-large;
        color: #fff;
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

        .good, .bad {
          margin: 24px 2px;
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
            }

            &.amber {
              background-color: orange;
            }

            &.green {
              background-color: darkgreen;
            }

            &.selected {
              border-color: #888;

              .far {
                color: #888;
              }
            }
          }
        }
      }
    }
  }
</style>
