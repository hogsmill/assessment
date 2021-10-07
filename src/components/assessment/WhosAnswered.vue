<template>
  <div class="whos-answered">
    <h3>
      Who's answered?
    </h3>
    <div>
      <i class="fas fa-arrow-circle-left" title="Previous question" @click="prev()" />
      <i class="fas fa-arrow-circle-right" title="Next question" @click="next()" />
      <i class="fas fa-poll-h" title="Go to Results" @click="goToResults()" />
    </div>
    <table v-if="assessment.team">
      <tr v-for="(member, index) in members()" :key="index">
        <td>
          <input type="checkbox" :checked="answered(member)">
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
  props: [
    'question'
  ],
  computed: {
    assessment() {
      return this.$store.getters.getAssessment
    },
    whosAnswered() {
      return this.$store.getters.getWhosAnswered
    },
    teams() {
      return this.$store.getters.getTeams
    },
  },
  methods: {
    prev() {
      bus.$emit('sendPrevQuestion', {assessment: this.assessment, question: this.question})
    },
    next() {
      bus.$emit('sendNextQuestion', {assessment: this.assessment, question: this.question})
    },
    goToResults() {
      bus.$emit('sendGoToResults', {assessment: this.assessment})
    },
    members() {
      const team = this.teams.find((t) => {
        return t.id == this.assessment.team.id
      })
      return team ? team.members : []
    },
    answered(member) {
      let answered = false
      if (this.whosAnswered.length) {
        const mem = this.whosAnswered.find((m) => {
          return m.id == member.id
        })
        answered = mem ? mem.questions[this.question.id] : false
      }
      return answered
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
