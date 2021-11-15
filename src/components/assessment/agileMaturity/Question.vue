<template>
  <div class="agile-maturity-question">
    <h3>
      <i class="fas" :class="'fa-' + areas[question.question.area]" :title="question.question.area" />
      {{ question.question.title }}
    </h3>
    <table>
      <tr v-for="(n, index) in Object.keys(question.question.levels).sort()" :key="index">
        <td>
          <i v-if="question.answer != n" class="far fa-square" @click="answer(n)" />
          <i v-if="question.answer == n" class="far fa-check-square" />
        </td>
        <td class="left bold">
          {{ question.question.levels[n].level }}
        </td>
        <td class="left">
          {{ question.question.levels[n].description }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import bus from '../../../socket.js'

export default {
  props: [
    'question'
  ],
  data() {
    return {
      keys: {
        0: 'zero',
        1: 'one',
        2: 'two',
        3: 'three',
        4: 'four'
      },
      areas: {
        'Principles': 'book',
        'Team Dynamics': 'users',
        'Technical Processes': 'industry',
        'Organizational Dynamics': 'sitemap'
      }
    }
  },
  computed: {
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    answer(n) {
      bus.$emit('sendAnswerQuestion', {assessment: this.assessment, questionId: this.question.id, answer: n})
    }
  }
}
</script>

<style lang="scss">
  .agile-maturity-question {
    margin: auto auto;
    max-width: 800px;
    display: inline-block;

    h3 {
      i {
        color: #f4511e !important;
        font-size: xx-large !important;
        position: relative;
        top: 2px;
      }
    }

    td {
      padding: 12px;
      line-height: 1.2;

      &.left {
        text-align: left;
      }

      &.bold {
        font-weight: bold;
      }

      .far {
        color: #f4511e !important;
      }
    }
  }
</style>
