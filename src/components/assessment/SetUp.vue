<template>
  <div class="setup">
    <table>
      <tr v-if="server.multipleTeams">
        <td>
          Team
        </td>
        <td>
          <select id="setup-select-team" @change="selectTeam()">
            <option>
              -- Select --
            </option>
            <option v-for="(t, tindex) in teams" :key="tindex" :selected="t.id == team" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="server.frequency">
        <td v-if="server.frequency == 'monthly'">
          Month:
        </td>
        <td v-if="server.frequency == 'monthly'">
          <select id="setup-select-month" @change="selectMonth()">
            <option>
              -- Select --
            </option>
            <option v-for="m in 12" :key="m" :selected="m == month">
              {{ m }}
            </option>
          </select>
        </td>
        <td v-if="server.frequency == 'quarterly'">
          Quarter:
        </td>
        <td v-if="server.frequency == 'quarterly'">
          <select id="setup-select-quarter" @change="selectQuarter()">
            <option>
              -- Select --
            </option>
            <option v-for="q in 4" :key="q" :selected="q == quarter">
              Q{{ q }}
            </option>
          </select>
        </td>
      </tr>
      <tr v-if="server.frequency">
        <td class="year">
          Year:
        </td>
        <td>
          <select id="setup-select-year" @change="selectYear()">
            <option>
              -- Select --
            </option>
            <option v-for="y in 10" :key="y" :selected="y == year">
              {{ y + 2020 }}
            </option>
          </select>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    server() {
      return this.$store.getters.getServer
    },
    teams() {
      return this.$store.getters.getTeams
    },
    team() {
      return this.$store.getters.getTeam
    },
    month() {
      return this.$store.getters.getMonth
    },
    quarter() {
      return this.$store.getters.getQuarter
    },
    year() {
      return this.$store.getters.getYear
    },
  },
  methods: {
    selectTeam() {
      const team = document.getElementById('setup-select-team').value
      this.$store.dispatch('updateTeam', team)
    },
    selectMonth() {
      const month = document.getElementById('setup-select-month').value
      this.$store.dispatch('updateMonth', month)
    },
    selectQuarter() {
      const quarter = document.getElementById('setup-select-quarter').value
      this.$store.dispatch('updateQuarter', quarter)
    },
    selectYear() {
      const year = document.getElementById('setup-select-year').value
      this.$store.dispatch('updateYear', year)
    },
  }
}
</script>

<style lang="scss">
  .setup {
    table {
      font-size: x-large;
      margin: 0 auto;
    }
  }
</style>
