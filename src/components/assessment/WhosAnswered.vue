<template>
  <div class="whos-answered">
    <h3>
      Who's answered?
    </h3>
    <div>
      <i class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
      <i class="fas fa-poll-h" title="Go to Results" @click="goToResults()" />
    </div>
    <table v-if="assessment.team">
      <tr v-for="(member, index) in members()" :key="index">
        <td>
          <input type="checkbox">
        </td>
        <td>
          {{ member.name }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import bus from '../../socket.js'

export default {
  computed: {
    assessment() {
      return this.$store.getters.getAssessment
    },
    teams() {
      return this.$store.getters.getTeams
    },
  },
  methods: {
    next() {
      bus.$emit('sendNextQuestion', {assessment: this.assessment})
    },
    goToResults() {
      bus.$emit('sendGoToResults', {assessment: this.assessment})
    },
    members() {
      const team = this.teams.find((t) => {
        return t.id == this.assessment.team.id
      })
      console.log(this.teams, this.assessment)
      return team ? team.members : []
    }
  }
}
</script>

<style lang="scss">
  .whos-answered {
    width: 200px;
    position: absolute;
    border: 1px solid;
    right: 12px;
    height: 500px;
    background-color: #fff;
  }
</style>
