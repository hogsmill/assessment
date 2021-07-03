<template>
  <div class="control" :class="{ 'selected': game == context }">
    <div class="tick">
      <i v-if="game != context" class="far fa-square" @click="setContext()" />
      <i v-if="game == context" class="far fa-check-square" />
    </div>
    <div class="text">
      <div>
        {{ header() }}
      </div>
      <div class="items">
        Items: {{ items() }}
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

export default {
  props: [
    'game'
  ],
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    controller() {
      return this.$store.getters.getController
    },
    context() {
      return this.$store.getters.getContext
    },
    switchingItems() {
      return this.$store.getters.getSwitchingItems
    },
    noSwitchingItems() {
      return this.$store.getters.getNoSwitchingItems
    },
    running() {
      return this.$store.getters.getRunning
    }
  },
  methods: {
    header() {
      return this.game == 'switching' ? 'Context Switching' : 'No Context Switching'
    },
    items() {
      return this.game == 'switching' ? this.switchingItems : this.noSwitchingItems
    },
    setContext() {
      if (this.controller && !this.running) {
        bus.$emit('sendSetContext', {gameName: this.gameName, context: this.game})
      }
    }
  }
}
</script>

<style lang="scss">
  .control {
    position: relative;
    display: inline-block;
    width: 320px;
    height: 100px;
    border-radius: 6px;
    border: 2px solid;
    margin: 6px 24px;
    font-size: x-large;

    &.selected {
      background-color: green;
      color: #fff;
      border-color: green;
    }

    .tick {
      display: inline-block;
      width: 60px;
      position: absolute;
      left: 0;
      top: 30px;

      .far {
        font-size: x-large;
      }
    }

    .text {
      display: inline-block;
      margin-top: 12px;
      padding-left: 32px;
    }
  }
  </style>
