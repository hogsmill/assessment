<template>
  <div class="container about">
    <h2>{{ appType }} - <span v-if="stealth">(Stealth)</span> Facilitator View</h2>
    <Connections />
    <Teams />
  </div>
</template>

<script>
import Connections from './facilitator/Connections.vue'
import Teams from './facilitator/Teams.vue'

export default {
  components: {
    Connections,
    Teams
  },
  computed: {
    appType() {
      return this.$store.getters.appType
    },
    hostId() {
      return this.$store.getters.getHostId
    },
    stealth() {
      return this.$store.getters.getStealth
    }
  },
  methods: {
    isDev() {
      return window.location.href.match('localhost')
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
