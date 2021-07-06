<template>
  <div class="five-dysfunctions-question">
    <div>
      {{ question.question }}
    </div>
    <div class="buttons">
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'always'}" @click="answer(question.id, 'always')">
        Always
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'sometimes'}" @click="answer(question.id, 'sometimes')">
        Sometimes
      </button>
      <button class="btn btn-info" :class="{ 'selected': question.answer == 'never'}" @click="answer(question.id, 'never')">
        Never
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
  methods: {
    answer(id, answer) {
      bus.$emit('sendSetAnswer', {id: id, answer: answer})
    }
  }
}
</script>

<style lang="scss">
  .five-dysfunctions-question {
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
</style>
