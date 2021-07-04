<template>
  <table class="facilitator-table questions-table">
    <tr>
      <td colspan="2">
        <h4>Team Health Check</h4>
        <i v-if="showTeamHealthCheck" @click="setShowTeamHealthCheck(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showTeamHealthCheck" @click="setShowTeamHealthCheck(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showTeamHealthCheck">
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Order
              </th>
              <th>
                Question
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(question, index) in questions" :key="index">
              <td>
                {{ question.order }}
              </td>
              <td>
                <table>
                  <tr>
                    <td rowspan="3">
                      <div class="actions">
                        <i v-if="question.protected" class="fas fa-trash-alt" title="Unable to delete system question" />
                        <i v-if="!question.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + question.order" @click="deleteQuestion(question)" />
                        <i v-if="question.order > 1" class="fas fa-arrow-up" title="Move question up" />
                        <i v-if="question.order < questions.length" class="fas fa-arrow-down" title="Move question down" />
                      </div>
                    </td>
                    <td>
                      Title
                    </td>
                    <td>
                      <div class="actions">
                        <i v-if="editingQuestionTitle != question.id" class="fas fa-edit" @click="setEditingQuestionTitle(question)" />
                        <i v-if="editingQuestionTitle == question.id" class="fas fa-save" @click="saveQuestionTitle(question)" />
                      </div>
                    </td>
                    <td>
                      <div class="question">
                        <span v-if="editingQuestionTitle != question.id">{{ question.question.title }}</span>
                        <input v-if="editingQuestionTitle == question.id" type="text" :id="'question-title-editing-' + question.id" :value="question.question.title">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Good
                    </td>
                    <td>
                      <div class="actions">
                        <i v-if="editingQuestionGood != question.id" class="fas fa-edit" @click="setEditingQuestionGood(question)" />
                        <i v-if="editingQuestionGood == question.id" class="fas fa-save" @click="saveQuestionGood(question)" />
                      </div>
                    </td>
                    <td>
                      <div class="question">
                        <span v-if="editingQuestionGood != question.id">{{ question.question.good }}</span>
                        <input v-if="editingQuestionGood == question.id" type="text" :id="'question-good-editing-' + question.id" :value="question.question.good">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      Bad
                    </td>
                    <td>
                      <div class="actions">
                        <i v-if="editingQuestionBad != question.id" class="fas fa-edit" @click="setEditingQuestionBad(question)" />
                        <i v-if="editingQuestionBad == question.id" class="fas fa-save" @click="saveQuestionBad(question)" />
                      </div>
                    </td>
                    <td>
                      <div class="question">
                        <span v-if="editingQuestionBad != question.id">{{ question.question.bad }}</span>
                        <input v-if="editingQuestionBad == question.id" type="text" :id="'question-bad-editing-' + question.id" :value="question.question.bad">
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <button class="btn btn-sm btn-secondary smaller-font" @click="addQuestion()">
                  Add New
                </button>
              </td>
              <td>
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

export default {
  data() {
    return {
      showTeamHealthCheck: false,
      editingQuestionTitle: null,
      editingQuestionGood: null,
      editingQuestionBad: null
    }
  },
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showTeamHealthCheck') {
        this.showTeamHealthCheck = false
      }
    })
  },
  methods: {
    setShowTeamHealthCheck(val) {
      this.showTeamHealthCheck = val
      if (val) {
        bus.$emit('openEditPane', 'showTeamHealthCheck')
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
    setEditingQuestionTitle(question) {
      this.editingQuestionTitle = question.id
    },
    setEditingQuestionGood(question) {
      this.editingQuestionGood = question.id
    },
    setEditingQuestionBad(question) {
      this.editingQuestionBad = question.id
    },
    saveQuestionTitle() {
      const title = document.getElementById('question-title-editing-' + this.editingQuestionTitle).value
      bus.$emit('sendUpdateQuestionTitle', {id: this.editingQuestionTitle, value: title})
      this.editingQuestionTitle = null
    },
    saveQuestionGood() {
      const good = document.getElementById('question-good-editing-' + this.editingQuestionGood).value
      bus.$emit('sendUpdateQuestionGood', {id: this.editingQuestionGood, value: good})
      this.editingQuestionGood = null
    },
    saveQuestionBad() {
      const bad = document.getElementById('question-bad-editing-' + this.editingQuestionBad).value
      bus.$emit('sendUpdateQuestionBad', {id: this.editingQuestionBad, value: bad})
      this.editingQuestionBad = null
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
