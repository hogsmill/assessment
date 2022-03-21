<template>
  <vue-final-modal name="question-c omments" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['questionComments']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <h3>
      Comments for <br>
      {{ modalData.commentsTitle }}
    </h3>
    <div class="mt-4 comments-list">
      <ul>
        <li v-for="(comment, index) in modalData.comments" :key="index">
          {{ comment.comment }}
          <span v-if="server.commentsBy">
            ({{ comment.by }})
          </span>
        </li>
      </ul>
    </div>
  </vue-final-modal>
</template>

<script>
import { VueFinalModal } from 'vue-final-modal'

export default {
  components: {
    VueFinalModal
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    modalData() {
      return this.$store.getters.getModalData
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'questionComments')
    }
  }
}
</script>
