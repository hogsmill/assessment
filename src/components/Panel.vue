<template>
  <div class="col">
    <h3>
      {{ getTime() }}
      <button id="go" :disabled="!controller || running || !context" class="btn btn-info" @click="go()">
        Go
      </button>
      <button id="stop" v-if="running" class="btn btn-info" @click="stop()">
        Stop
      </button>
    </h3>
    <div class="game" :class="{'visible': running}">
      <h3>Think of something that is <b>{{ topics[active].topic }}</b> </h3>
      <div class="">
        <input type="text" id="switching-input" class="form-control switching-input" @keyup.enter="enter()">
        <div v-for="(item, itemIndex) in topics[active].items" :key="itemIndex" class="item">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import bus from '../socket.js'

import timeFuns from '../lib/time.js'

export default {
  data() {
    return {
      time: 0
    }
  },
  computed: {
    gameName() {
      return this.$store.getters.getGameName
    },
    context() {
      return this.$store.getters.getContext
    },
    controller() {
      return this.$store.getters.getController
    },
    topics() {
      return this.$store.getters.getTopics
    },
    active() {
      return this.$store.getters.getActiveTopic
    },
    noOfItems() {
      return this.$store.getters.getNoOfItems
    },
    running() {
      return this.$store.getters.getRunning
    }
  },
  mounted() {
    bus.$on('start', (data) => {
      if (data.gameName == this.gameName && data.context == this.context) {
        this.$store.dispatch('updateRunning', true)
        this.start()
      }
    })
    bus.$on('stop', (data) => {
      if (data.gameName == this.gameName && data.context == this.context) {
        this.$store.dispatch('updateRunning', false)
        this.clear()
      }
    })
    bus.$on('setTopics', (data) => {
      if (data.gameName == this.gameName && data.context == this.context) {
        this.$store.dispatch('updateTopics', data)
      }
    })
    bus.$on('tick', (data) => {
      if (data.gameName == this.gameName && data.context == this.context) {
        this.tick(data.time)
      }
    })
    bus.$on('addTopicValue', (data) => {
      if (data.gameName == this.gameName && data.context == this.context) {
        this.$store.dispatch('addTopicValue', data)
      }
    })
  },
  methods: {
    getTime() {
      return timeFuns.format(this.time)
    },
    checkTopicValue(value) {
      return !this.topics[this.active].items.find((item) => {
        return item == value
      })
    },
    setTopicActive(n, active) {
      if (active) {
        document.getElementsByClassName('switching-input')[n].focus()
      }
    },
    go() {
      bus.$emit('sendStart', {gameName: this.gameName, context: this.context})
    },
    stop() {
      bus.$emit('sendStop', {gameName: this.gameName, context: this.context})
    },
    tick(t) {
      if (this.context == 'noSwitching' && t > 0 && t % 20 == 0) {
        const topic = this.active + 1
        this.$store.dispatch('updateActiveTopic', {context: this.context, topic: topic})
      }
      this.time = t
    },
    start() {
      bus.$emit('sendSetTopics', {gameName: this.gameName, context: this.context})
      this.setTopicActive(0, true)
    },
    clear() {
      this.time = 0
      for (let i = 0; i < this.topics.length; i++) {
        this.topics[i].active = false
      }
    },
    setNextTopic() {
      let topic = this.active
      while (topic == this.active) {
        topic = Math.round(Math.random() * 2)
      }
      this.$store.dispatch('updateActiveTopic', {context: this.context, topic: topic})
    },
    enter() {
      const input = document.getElementById('switching-input')
      const value = input.value
      if (!this.checkTopicValue(value)) {
        alert(value + ' already exists')
      } else {
        bus.$emit('sendAddTopicValue', {gameName: this.gameName, context: this.context, topic: this.active, value: value})
      }
      input.value = ''
      if (this.context == 'switching') {
        this.setNextTopic()
      }
    }
  }
}
</script>

<style lang="scss">
  .game {
    display: none;

    &.visible {
      display: block;
    }

    .switching-input {
      max-width: 400px;
      margin: 0 auto;
      border: 2px solid;
    }
    .item {
      width: 200px;
      display: block;
      margin: 0 auto;
      color: #888;
      font-style: italic;
      font-weight: bold;
    }
  }
</style>
