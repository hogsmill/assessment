<template>
  <div>
    <Feedback v-if="modals['feedback']" />
    <FiveDysfunctionsWalkThrough v-if="appType == '5 Dysfunctions' && modals['walkThrough']" />
    <TeamHealthCheckWalkThrough v-if="appType == 'Team Health Check' && modals['walkThrough']" />
    <Comment v-if="modals['comment']" />
    <QuestionComments v-if="modals['questionComments']" />
  </div>
</template>

<script>
import Feedback from './modals/Feedback.vue'
import FiveDysfunctionsWalkThrough from './modals/FiveDysfunctionsWalkThrough.vue'
import TeamHealthCheckWalkThrough from './modals/TeamHealthCheckWalkThrough.vue'
import Comment from './modals/Comment.vue'
import QuestionComments from './modals/QuestionComments.vue'

export default {
  components: {
    Feedback,
    FiveDysfunctionsWalkThrough,
    TeamHealthCheckWalkThrough,
    Comment,
    QuestionComments
  },
  computed: {
    modals() {
      return this.$store.getters.getModals
    },
    appType() {
      return this.$store.getters.appType
    }
  }
}
</script>

<style lang="scss">

  .modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal-content {
    display: flex;
    flex-direction: column;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
    width: 90%;
    max-width: 850px;
  }
  .modal__title {
    font-size: 1.5rem;
    font-weight: 700;
  }

  .modal-content {
    letter-spacing: 0;
    color: #212529;

    p.modal-form {
      margin: o auto;
      margin-bottom: 12px;
    }

    .modal-form {
      width: 80%;
      margin: 0 auto;
    }
  }
</style>
