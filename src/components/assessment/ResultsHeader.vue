<template>
  <div class="result">
    <div class="question" />
    <div class="answer">
      <div v-for="(date, index) in Object.keys(results[Object.keys(results)[0]].results)" :key="index" class="answer-header">
        {{ date }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'results'
  ]
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
        padding: 0 12px;

        .answer-header {
          width: 106px;
          text-align: center;
        }
      }
    }
  }
</style>
