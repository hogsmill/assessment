<template>
  <div class="result">
    <div class="result-dysfunction">
      {{ result.question }}
    </div>
    <div class="answer dysfunction-answer">
      <div v-for="(res, index) in Object.keys(result.results)" :key="index" class="answer-header">
        <div class="result-value">
          <div :class="dysfunctionClass(result.results[res].answer)" :title="dysfunctionTitle(result.results[res])">
            {{ result.results[res].answer }} / 9
          </div>
        </div>
        <!--
        <i v-if="index > 0" class="fas trend" :class="trendClass(index)" />
        -->
      </div>
    </div>
    <div class="status">
      {{ status() }}
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'result',
    'last',
    'scope'
  ],
  methods: {
    status() {
      const last = Object.keys(this.result.results).reverse() [0]
      return this.dysfunctionTitle(this.result.results[last])
    },
    dysfunctionClass(score) {
      let str = ''
      if (score >= 8) {
        str = 'ok'
      } else if (score >= 5) {
        str = 'worry'
      } else {
        str = 'address'
      }
      return str
    },
    dysfunctionTitle(score) {
      let str = ''
      if (score >= 8) {
        str = 'Everything\'s fine...'
      } else if (score >= 5) {
        str = 'This could be a worry'
      } else {
        str = 'This needs addressing'
      }
      return str
    }
  }
}
</script>

<style lang="scss">
  .result {
    div {
      display: inline-block;
      vertical-align: middle;

      &.result-dysfunction {
        width: 20%;
      }

      &.dysfunction-answer {
        width: 20%;
      }
      
      &.result-value {
        margin: 3px;
        color: #fff;
        text-align: left;

        div {
          padding: 6px;
          border-radius: 4px;

          &.ok {
            background-color: green;
          }
          &.worry {
            background-color: darkorange;
          }
          &.address {
            background-color: red;
          }
        }

        i {
          margin-left: 6px;
          color: #bbb;
        }
      }
    }

    .status {
      margin-bottom: 24px;
      font-style: italic;
    }
  }
</style>
