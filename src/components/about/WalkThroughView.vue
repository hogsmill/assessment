<template>
  <div class="explain">
    <button
      v-if="!showAbout"
      class="btn btn-sm btn-info"
      @click="help"
    >
      Explain this for me...
    </button>

    <modal name="walk-through" id="walk-through" :height="350" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to Context Switching</h4>
        <div>
          <p>
            This activity demonstrates the effects of context switching,
          </p>
          <p>
            After playing
            this, maybe you'll realise how expensive a 5 minute interruption when a
            developer is "in the zone" actually is...
          </p>
          <Facilitation />
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to Context Switching</h4>
        <div>
          <p>
            The game is simple - you get 3 topics, and you have to type in as many
            items in that topic as you can think of in a minute.
          </p>
          <ul>
            <li>
              In the "<em>No Switching</em>" game (on left), the topic changes every
              20 seconds
            </li>
            <li>
              In the "<em>Switching</em>" game (on right), the topic changes every
              time an item is typed in.
            </li>
          </ul>
          <p>
            Players will usually think of more item in the "No Switching" game, as
            they are not context switching
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Game Play</h4>
        <p>
          Simply press "Go", and type in items in the highlighted box.
        </p>
        <p>Note: Press Return, not Tab, to enter items...</p>
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Game Play</h4>
        <p>
          If you want to play as a team, simply set the Game Name (top left) to
          the same for each team member before you start the game.
        </p>
      </div>
      <div class="buttons" v-if="step < noOfScreens()">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="hide()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == noOfScreens()">
        <button class="btn btn-info" @click="hide()">
          Play Game
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
import params from '../../lib/params.js'

import Facilitation from './Facilitation.vue'

export default {
  components: {
    Facilitation
  },
  data() {
    return {
      step: 1,
      default: { width: 600, height: 260 },
      positions: {
        2: { height: 350 },
        3: { height: 220 },
        4: { height: 220 }
      }
    }
  },
  computed: {
    thisGame() {
      return this.$store.getters.thisGame
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
    },
    showAbout() {
      return this.$store.getters.getShowAbout
    },
  },
  mounted() {
    const self = this
    if (params.isParam('walkThrough')) {
      self.$store.dispatch('updateWalkThrough', true)
      self.$modal.show('walk-through')
    }
  },
  methods: {
    noOfScreens() {
      return Object.keys(this.positions).length + 1
    },
    setDefault() {
      const elem = document.getElementsByClassName('vm--modal')[0].getBoundingClientRect()
      this.default = {
        top: elem.top,
        left: elem.left,
        width: elem.width,
        height: elem.height
      }
    },
    show() {
      this.$modal.show('walk-through')
    },
    hide() {
      this.$modal.hide('walk-through')
    },
    help() {
      this.step = 1
      this.show()
    },
    incrementStep() {
      if (this.step == 1) {
        this.setDefault()
      }
      this.step = this.step + 1
      const elem = document.getElementsByClassName('vm--modal')[0]
      let target, positions = {}
      if (this.positions[this.step].target) {
        target = document.getElementById(this.positions[this.step].target)
        target = target.getBoundingClientRect()
        positions.left = target.left + 30
        positions.top = target.top + 30
      } else {
        positions = this.default
      }
      if (this.positions[this.step].width) {
        positions.width = this.positions[this.step].width
      }
      if (this.positions[this.step].height) {
        positions.height = this.positions[this.step].height
      }
      elem.style.left = positions.left + 'px'
      elem.style.top = positions.top + 'px'
      elem.style.width = positions.width + 'px'
      elem.style.height = positions.height +'px'
    }
  }
}
</script>

<style lang="scss">
  .explain {
    display: inline-block;
    margin: 2px 6px;
  }

  .buttons {
    padding: 6px;
  }

  #walk-through {
    max-width: 100%;

    p, li {
      text-align: left;
      margin-left: 16px;
      margin-right: 16px;
    }
    #email {
      width: 50%;
      margin: 6px;
    }
 }
</style>
