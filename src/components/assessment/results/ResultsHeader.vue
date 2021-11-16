<template>
  <div class="result">
    <div class="question" />
    <div v-if="results && Object.keys(results).length" class="answer">
      <div v-for="(date, index) in Object.keys(results[Object.keys(results)[0]].results)" :key="index" class="answer-header">
        {{ dateLabel(date) }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'results'
  ],
  methods: {
    dateLabel(d) {
      if (d.match(/\-\d{1}/)) {
        const l = d.split('-')
        d = l[0] + '-Q' + l[1]
      }
      return d
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
        padding: 0 12px;

        .answer-header {
          width: 106px;
          text-align: center;
        }
      }
    }
  }
</style>
