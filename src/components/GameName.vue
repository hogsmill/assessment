<template>
  <div class="game-name" v-if="!showAbout">
    <div class="game-name">
      <button class="btn btn-sm btn-info" @click="show">
        Set Game Name
      </button>
    </div>

    <modal name="set-game-name" :height="120" :classes="['rounded', 'game-name-modal']">
      <div class="text-right">
        <span @click="hide" class="glyphicon glyphicon-star">x</span>
      </div>
      <h4>Enter Your Game Name</h4>
      <div class="set-game-name">
        <input type="text" id="game-name" class="form-control">
        <button class="btn btn-sm btn-info" @click="saveGameName">
          Save
        </button>
      </div>
    </modal>
  </div>
</template>

<script>
export default {
  computed: {
    showAbout() {
      return this.$store.getters.getShowAbout
    },
    gameName() {
      return this.$store.getters.getGameName
    }
  },
  methods: {
    show () {
      this.$modal.show('set-game-name')
    },
    hide () {
      this.$modal.hide('set-game-name')
    },
    saveGameName: function() {
      const gameName = document.getElementById('game-name').value
      this.$store.dispatch('updateGameName', gameName)
      this.hide()
    }
  },
}
</script>

<style lang="scss">
  .game-name {
    display: inline-block;
    margin: 2px 6px;

    button {
      font-size: smaller;
      background-color: #aaa;
      border: 1px solid #aaa;

      &:hover {
        color: #aaa;
        background-color: #fff;
      }
    }
  }

  .game-name-modal {
    height: 120px;
    max-width: 100%;
  }

  #game-name {
    display: inline-block;
    width: 30%; margin-right: 6px;
  }

@media screen and (max-width: 767px) {
  .game-name-modal {
    left: 0 !important;
  }
}
</style>
