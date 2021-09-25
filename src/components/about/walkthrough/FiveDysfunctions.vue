<template>
  <span>
    <button class="btn btn-sm btn-info mb-2" @click="help()">
      Explain this for me...
    </button>

    <modal name="walk-through" id="walk-through" :height="500" :classes="['rounded']">
      <div class="float-right mr-2 mt-1">
        <button type="button" class="close" @click="hide" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="mt-4" v-if="step == 1">
        <h4>Welcome to the {{ appType }} assessment</h4>
        <div>
          <p>
            It's important to take the pulse of teams regularly, to uncover issues and
            trends that need addressing, but also to celebrate improvements. The Spotify
            Health Check model is commonly used to do this, and this assessment allows you
            to do this easily and effectively without having to spend time and effort building
            up your own analysis tools.
          </p>
          <Generic :step="1" />
          <Facilitation />
        </div>
      </div>
      <div class="mt-4" v-if="step == 2">
        <h4>Welcome to the {{ appType }} Assessment</h4>
        <div>
          <p>
            The 5 dysfunctions of a team are normally depicted as a pyramid, thus:
          </p>
          <div class="pyramid" />
          <p>
            The dysfunctions "stack" on each other, meaning that you need to resolve the "lower layers"
            before having a chance to resolve the higher layers.
          </p>
          <p>
            Read teh book <i>The Five Dysfunctions of a Team: A Leadership Fable (J–B Lencioni Series)</i>
            for more details.
          </p>
        </div>
      </div>
      <div class="mt-4" v-if="step == 3">
        <h4>Welcome to the {{ appType }} Assessment</h4>
        <Generic :step="2" />
      </div>
      <div class="mt-4" v-if="step == 4">
        <h4>Welcome to the {{ appType }} Assessment</h4>
        <Generic :step="3" />
      </div>
      <div class="mt-4" v-if="step == 5">
        <h4>Welcome to the {{ appType }} Assessment</h4>
        <Generic :step="4" />
      </div>
      <div class="buttons" v-if="step < 5">
        <button class="btn btn-info" @click="incrementStep">
          Next
        </button>
        <button class="btn btn-info" @click="skip()">
          Skip
        </button>
      </div>
      <div class="buttons" v-if="step == 5">
        <button class="btn btn-info" @click="hide()">
          Go To Assessment
        </button>
      </div>
    </modal>
  </span>
</template>

<script>
import params from '../../../lib/params.js'

import Generic from './Generic.vue'
import Facilitation from '../Facilitation.vue'

export default {
  components: {
    Generic,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    walkThrough() {
      return this.$store.getters.getWalkThrough
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
    skip() {
      this.hide()
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
#walk-through {
  h4 {
    margin-bottom: 24px;
  }

  p {
    text-align: left;
    margin: 0 24px 12px 24px;

    &.center {
      text-align: center;
    }
  }

  .pyramid {
    height: 200px;
    margin: 0 24px;
    background-image: url("../../../assets/img/pyramid.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    left: 228px;
  }
}
</style>
