<template>
  <div class="result">
    <div class="question">
      {{ question.question.title }} {{ question }}
    </div>
    <div class="answer">
      <div class="answer-holder" :class="question.answer">
        <i class="far" :class="answerClass(question.answer)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'question'
  ],
  methods: {
    answerClass(answer) {
      let answerClass = ''
      switch(answer) {
        case 'red':
          answerClass = 'fa-frown'
          break
        case 'amber':
          answerClass = 'fa-meh'
          break
        case 'green':
          answerClass = 'fa-smile-beam'
          break
      }
      return answerClass
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

          &.red {
            background-color: red;
          }

          &.amber {
            background-color: orange;
          }

          &.green {
            background-color: darkgreen;
          }
        }
      }
    }
  }
</style>
