<template>
  <div class="container about">
    <h2>{{ appType }} - Facilitator View</h2>
    <Connections />
    <Server />
    <Teams v-if="server.multipleTeams" />
    <Team v-if="!server.multipleTeams" />
    <Members />
    <FiveDysfunctions v-if="appType == '5 Dysfunctions'" />
    <TeamHealthCheck v-if="appType == 'Team Health Check'" />
  </div>
</template>

<script>
import Connections from './facilitator/Connections.vue'
import Server from './facilitator/Server.vue'
import Teams from './facilitator/Teams.vue'
import Team from './facilitator/Team.vue'
import Members from './facilitator/Members.vue'
import FiveDysfunctions from './facilitator/FiveDysfunctions.vue'
import TeamHealthCheck from './facilitator/TeamHealthCheck.vue'

export default {
  components: {
    Connections,
    Server,
    Teams,
    Team,
    Members,
    FiveDysfunctions,
    TeamHealthCheck
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    server() {
      return this.$store.getters.getServer
    }
  }
}
</script>

<style lang="scss">
.facilitator-table {

    width: 90%;
    max-width: 800px;
    margin: 12px auto;
    border: 1px solid #ccc;

    button {
      margin-left: 6px;
    }

    .inner-table {
      padding: 0;
      border: none;

      td {
        border: 0;
      }
    }
    .toggle {
      color: #aaa;
      font-size: xx-large;
      position: absolute;
      right: 6px;
    }

    .left {
      text-align: left;
    }

    h4 {
      width: 50%;
      display: inline-block;
      text-align: left;
    }

    td {
      vertical-align: top;
      position: relative;
      padding: 4px;
      text-align: left;
      border: 1px solid #ccc;

      &.center {
        text-align: center;
      }

      &.left-col {
        vertical-align: top;
      }

      &.upload {
        div {
          padding: 6px;
          min-width: 300px;
        }
      }
    }
    .fas {
      color: #888;
      font-size: x-large;

      &.enabled:hover {
        cursor: pointer;
        color: #5a6268
      }
    }
    input[type=text] {
      min-width: 120px;
      height: 24px;
      padding: 2px;
      margin: 0 auto;
    }
    input[type=number] {
      min-width: 60px;
      height: 24px;
      padding: 2px;
      margin: 0 auto;
      text-align: right;
    }
    input[type=checkbox] {
      min-width: 30px;
    }
    select {
      min-width: 120px;
    }
  }
</style>
