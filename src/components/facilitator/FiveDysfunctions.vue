<template>
  <table class="facilitator-table questions-table">
    <tr>
      <td colspan="2">
        <h4>Questions</h4>
        <i v-if="showFiveDysfunctions" @click="setShowFiveDysfunctions(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showFiveDysfunctions" @click="setShowFiveDysfunctions(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showFiveDysfunctions">
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Order
              </th>
              <th>
                Actions
              </th>
              <th>
                Question
              </th>
              <th>
                DysFunction
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in questions" :key="index">
              <td>
                {{ question.order }}
              </td>
              <td>
                <div class="actions">
                  <i v-if="question.protected" class="fas fa-trash-alt" title="Unable to delete system question" />
                  <i v-if="!question.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + question.order" @click="deleteQuestion(question)" />
                  <i v-if="editingQuestion != question.id" class="fas fa-edit" @click="setEditingQuestion(question)" />
                  <i v-if="editingQuestion == question.id" class="fas fa-save" @click="saveQuestion(question)" />
                  <i v-if="question.order > 1" class="fas fa-arrow-up" title="Move question up" />
                  <i v-if="question.order < questions.length" class="fas fa-arrow-down" title="Move question down" />
                </div>
              </td>
              <td>
                <div class="question">
                  <span v-if="editingQuestion != question.id">{{ question.question.question }}</span>
                  <input v-if="editingQuestion == question.id" type="text" :id="'question-editing-' + question.id" :value="question.question.question">
                </div>
              </td>
              <td>
                <span v-if="editingQuestion != question.id">{{ question.question.dysfunction }}</span>
                <Dysfunctions v-if="editingQuestion == question.id" :id="question.id" />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addQuestion()">
                  Add New
                </button>
              </td>
              <td colspan="2">
                <input type="text" id="new-question">
              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </table>
</template>

<script>
import bus from '../../socket.js'

import Dysfunctions from './fiveDysfunctions/Dysfunctions.vue'

export default {
  components: {
    Dysfunctions
  },
  data() {
    return {
      showFiveDysfunctions: false,
      editingQuestion: null
    }
  },
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showFiveDysfunctions') {
        this.showFiveDysfunctions = false
      }
    })
  },
  methods: {
    setShowFiveDysfunctions(val) {
      this.showFiveDysfunctions = val
      if (val) {
        bus.$emit('openEditPane', 'showFiveDysfunctions')
      }
    },
    addQuestion() {
      const question = document.getElementById('new-question').value
      bus.$emit('sendAddQuestion', {question: question})
    },
    deleteQuestion(question) {
      if (confirm('Delete question ' + question.order)) {
        bus.$emit('sendDeleteQuestion', {id: question.id})
      }
    },
    setEditingQuestion(question) {
      this.editingQuestion = question.id
    },
    saveQuestion() {
      const question = document.getElementById('question-editing-' + this.editingQuestion).value
      const dysfunction = document.getElementById('dysfunction-' + this.editingQuestion).value
      bus.$emit('sendUpdateQuestionQuestion', {id: this.editingQuestion, value: question})
      bus.$emit('sendUpdateQuestionDysfunction', {id: this.editingQuestion, value: dysfunction})
      this.editingQuestion = null
    }
  }
}
</script>

<style lang="scss">
  .questions-table {
    width: 100%;
    margin: 0 auto;

    th {
      text-align: center;
      padding: 2px 6px;
    }

    td {
      &.center {
        text-align: center;
      }

      .actions {
        width: 120px;
        text-align: center;

        .fas {
          margin: 2px 2px;
        }
      }

      .question {
        width: 600px;

        input {
          width: 590px;
        }
      }
    }
  }
</style>
