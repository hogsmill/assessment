<template>
  <vue-final-modal name="feedback" classes="modal-container" content-class="vfm__content modal-content" v-model="modals['comment']">
    <div class="float-right mr-2 mt-1">
      <button type="button" class="close" @click="hide" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="mt-4">
      <h4>
        Comment on <br>
        {{ modalData.questionText }}
      </h4>
      <div class="comment-form">
        <textarea id="comment" rows="6" class="form-control" placeholder="Your comment" />
        <button class="btn btn-sm btn-secondary smaller-font" @click="saveComment()">
          Save Comment
        </button>
      </div>
    </div>
  </vue-final-modal>
</template>

<script>
import bus from '../../socket.js'

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
    },
    assessment() {
      return this.$store.getters.getAssessment
    }
  },
  methods: {
    hide() {
      this.$store.dispatch('hideModal', 'comment')
    },
    saveComment() {
      const comment = document.getElementById('comment').value
      console.log({assessment: this.assessment, questionId: this.questionId, comment: comment})
      bus.emit('sendSaveComment', {assessment: this.assessment, questionId: this.modalData.questionId, comment: comment})
      this.hide()
    }
  }
}
</script>
