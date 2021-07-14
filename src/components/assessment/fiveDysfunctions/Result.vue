<template>
  <div class="result">
    <div class="result-dysfunction">
      {{ dysfunction }}
    </div>
    <div class="result-value">
      <div :class="dysfunctionClass(value)" :title="dysfunctionTitle(value)">
        {{ value }} / 9
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    'dysfunction',
    'value'
  ],
  methods: {
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
        width: 40%;
      }
      &.result-value {
        margin: 3px;
        color: #fff;
        width: 20%;

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
      }
    }
  }
  </style>
