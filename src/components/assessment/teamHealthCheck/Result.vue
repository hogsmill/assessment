<template>
  <div class="result">
    <div class="question">
      {{ result.question }}
    </div>
    <div class="answer">
      <div v-for="(res, index) in Object.keys(result.results)" :key="index" class="answer-header">
        <div class="answer-holder" :class="answerHolderClass(result.results[res])">
          <i v-if="typeof(result.results[res]) == 'string'" class="far" :class="answerClass(result.results[res])" />
          <span v-if="typeof(result.results[res]) == 'number'">{{ result.results[res] }}</span>
        </div>
        <!--
        <i class="fas" :class="trendClass()" />
        -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'result'
  ],
  methods: {
    answerHolderClass(answer) {
      let answerHolderClass = answer
      if (typeof(answer) == 'number') {
        if (answer < 33) {
          answerHolderClass = 'red'
        } else if (answer < 66) {
          answerHolderClass = 'amber'
        } else {
          answerHolderClass = 'green'
        }
      }
      return answerHolderClass
    },
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
    },
    trendClass() {
      /*
      up = 'fas fa-long-arrow-alt-up'
      same = 'fas fa-arrows-alt-h'
      down = 'fas fa-long-arrow-alt-down'
      */
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
