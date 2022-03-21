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
          The assessment works by presenting a set of topics, and a statement
          describing a "great", and a "terrible" description of that state.
        </p>
        <div class="health-check-question" />
        <p>
          Participants simple decide if the great (red) or terrible (green)
          statement best describes the current state in their team. They can
          decide on neither (amber) if they really can't decide.
        </p>
      </div>
    </div>
    <div class="mt-4" v-if="step == 3">
      <h4>Welcome to the {{ appType }} Assessment</h4>
      <p>
        Once all participants have answered all the questions, the data is presented
        back to allow good and bad areas to be discussed and addressed.
      </p>
      <p>
        You can test this assessment out and get the results mailed by pressing
        <button class="btn btn-info">
          Skip
        </button>, then completing your details and pressing
        <button class="btn btn-info">
          Start
        </button>
      </p>
      <DataIntro :app="'Team Health Checks'" />
    </div>
    <div class="mt-4" v-if="step == 4">
      <h4>Welcome to the {{ appType }} Assessment</h4>
      <p>
      </p>
    </div>
    <div class="mt-4" v-if="step == 5">
      <h4>Welcome to the {{ appType }} Assessment</h4>
      <Generic :step="3" />
    </div>
    <div class="mt-4" v-if="step == 6">
      <h4>Welcome to the {{ appType }} Assessment</h4>
      <Generic :step="4" />
    </div>
    <div class="buttons" v-if="step < 6">
      <button class="btn btn-info" @click="incrementStep">
        Next
      </button>
      <button class="btn btn-info" @click="skip()">
        Skip
      </button>
    </div>
    <div class="buttons" v-if="step == 6">
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
    hide() {
      this.$store.dispatch('hideModal', 'walkThrough')
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

  .buttons {
    padding: 6px;
    bottom: 20px;
    left: 228px;
  }

  .health-check-question {
    height: 200px;
    margin: 0 24px;
    background-image: url("../../assets/img/health-check-question.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .health-check-table {
    height: 200px;
    margin: 0 24px;
    background-image: url("../../assets/img/health-check-table.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .health-check-org {
    height: 200px;
    margin: 0 24px;
    background-image: url("../../assets/img/health-check-org.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .health-check-team {
    height: 200px;
    margin: 0 24px;
    background-image: url("../../assets/img/health-check-team.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>
