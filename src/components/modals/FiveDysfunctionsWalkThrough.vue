<template>
  <vue-final-modal name="walk-through" classes="modal-container" content-class="vfm__content modal-content walk-through" v-model="modals['walkThrough']">
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
          Read the book <i>The Five Dysfunctions of a Team: A Leadership Fable (J–B Lencioni Series)</i>
          for more details.
        </p>
        <DataIntro :app="'5 Dysfunctions'" />
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
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

import DataIntro from './walkThrough/DataIntro.vue'
import Generic from './walkThrough/Generic.vue'
import Facilitation from './walkThrough/Facilitation.vue'

export default {
  components: {
    VueFinalModal,
    DataIntro,
    Generic,
    Facilitation
  },
  data() {
    return {
      step: 1
    }
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    appType() {
      return this.$store.getters.appType
    }
  },
  methods: {
    skip() {
      this.hide()
    },
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
    },
    incrementStep() {
      this.step = this.step + 1
    }
  }
}
</script>

<style lang="scss">
  .buttons {
    padding: 6px;
    position: absolute;
    bottom: 20px;
    width: 100%;
  }

  .walk-through {
    height: 480px;
    p {
      text-align: left;
      margin: 0 24px 12px 24px;

      &.center {
        text-align: center;
      }
    }
    ul {
      margin-bottom: 12px;

      li {
        margin: 6px 24px 12px 36px;
        text-align: left;
      }
    }
    .pyramid {
      height: 200px;
      margin: 0 24px;
      background-image: url("../../assets/img/pyramid.jpg");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
    }
  }
</style>
