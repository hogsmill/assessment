<template>
  <table>
    <thead>
      <tr>
        <th>
          Question
        </th>
        <th>
          Include?
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(question, index) in questionsInclude" :key="index">
        <td>
          {{ question.question }}
        </td>
        <td>
          <input type="checkbox" :id="'question-' + question.id" :checked="question.include" @click="toggleInclude(question.id)">
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  computed: {
    questionsInclude() {
      return this.$store.getters.getQuestionsInclude
    }
  },
  methods: {
    toggleInclude(id) {
      this.$store.dispatch('toggleInclude', {id: id})
    }
  }

}
</script>

<style lang="scss">
  table {
    margin: 0 auto;
  }
</style>
