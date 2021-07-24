<template>
  <div class="team-health-check-question">
    <h3>
      {{ question.question.title }}
    </h3>
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
      <button class="btn btn-info red" :class="{ 'selected': question.answer == 'red'}" @click="answer('red')">
        <i class="far fa-frown" />
      </button>
      <button class="btn btn-info amber" :class="{ 'selected': question.answer == 'amber'}" @click="answer('amber')">
        <i class="far fa-meh" />
      </button>
      <button class="btn btn-info green" :class="{ 'selected': question.answer == 'green'}" @click="answer('green')">
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
  .team-health-check-question {
    margin: auto auto;
    width: 600px;
    display: inline-block;

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
