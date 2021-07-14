<template>
  <div class="team-health-check-question">
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
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'question'
  ],
  computed: {
    assessmentId() {
      return this.$store.getters.getAssessmentId
    }
  },
  methods: {
    answer(id, answer) {
      bus.$emit('sendSetAnswer', {id: this.assessmentId, questionId: id, answer: answer})
    }
  }
}
</script>

<style lang="scss">
  .team-health-check-question {
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
</style>
