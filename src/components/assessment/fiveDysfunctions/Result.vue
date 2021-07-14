<template>
  <div class="result">
    <div class="result-question">
      {{ question.question }}
    </div>
    <div class="result-answer">
      {{ question.answer }}
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'question'
  ]
}
</script>

<style lang="scss">
  .result {
    div {
      display: inline-block;
      vertical-align: middle;

      &.result-question {
        width: 80%;
      }
      &.result-answer {
        width: 20%;
      }
    }
  }
  </style>
