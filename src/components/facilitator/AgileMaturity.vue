<template>
  <table class="facilitator-table questions-table">
    <tr>
      <td colspan="2">
        <h4>Questions</h4>
        <i v-if="showAgileMaturity" @click="setShowAgileMaturity(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showAgileMaturity" @click="setShowAgileMaturity(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showAgileMaturity">
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Include
              </th>
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
                <input type="checkbox" :checked="question.include" @click="toggleInclude(question)">
              </td>
              <td>
                {{ question.order }}
              </td>
              <td>
                <select>
                  <option>
                    -- Select --
                  </option>
                  <option v-for="(area, aindex) in questionAreas" :key="aindex" :selected="area == question.question.area">
                    {{ area }}
                  </option>
                </select>
              </td>
              <td>
                <table class="question-holder-table">
                  <tr>
                    <td rowspan="3">
                      <div class="actions">
                        <i v-if="question.protected" class="fas fa-trash-alt" title="Unable to delete system question" />
                        <i v-if="!question.protected" class="fas fa-trash-alt enabled" :title="'Delete ' + question.order" @click="deleteQuestion(question)" />
                        <i v-if="question.order > 1" class="fas fa-arrow-up" title="Move question up" @click="moveQuestionUp(question.id)" />
                        <i v-if="question.order < questions.length" class="fas fa-arrow-down" title="Move question down" @click="moveQuestionUp(question.id)" />
                      </div>
                    </td>
                    <td class="title">
                      Title
                    </td>
                    <td class="inline">
                      <div class="actions">
                        <i v-if="editingQuestionTitle != question.id" class="fas fa-edit" @click="setEditingQuestionTitle(question)" />
                        <i v-if="editingQuestionTitle == question.id" class="fas fa-save" @click="saveQuestionTitle(question)" />
                      </div>
                      <div class="title">
                        <span v-if="editingQuestionTitle != question.id">{{ question.question.title }}</span>
                        <input v-if="editingQuestionTitle == question.id" type="text" :id="'question-title-editing-' + question.id" :value="question.question.title">
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3">
                      <table class="question-table">
                        <tr v-for="(n, lindex) in 5" :key="lindex">
                          <td>
                            {{ question.question.levels[n].level }}
                            <div class="actions">
                              <i v-if="!editingLevel(question, n)" class="fas fa-edit" @click="setEditingQuestionLevel(question, n)" />
                              <i v-if="editingLevel(question, n)" class="fas fa-save" @click="saveQuestionLevel(question, n)" />
                            </div>
                          </td>
                          <td>
                            <span v-if="!editingLevel(question, n)">{{ question.question.levels[n].description }}</span>
                            <textarea v-if="editingLevel(question, n)" type="text" :id="'question-level-editing-' + question.id + '-' + n" :value="question.question.levels[n].description" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <table>
                  <tr>
                    <td rowspan="3">
                      <button class="btn btn-sm btn-secondary smaller-font" @click="addQuestion()">
                        Add New
                      </button>
                    </td>
                    <td>
                      <table>
                        <tr>
                          <td>
                            Area
                          </td>
                          <td>
                            <select id="question-new-area">
                              <option>
                                -- Select --
                              </option>
                              <option v-for="(area, index) in questionAreas" :key="index">
                                {{ area }}
                              </option>
                            </select>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Title
                          </td>
                          <td>
                            <input type="text" id="question-new-title">
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
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
      showAgileMaturity: false,
      editingQuestionTitle: null,
      editingQuestionLevel: {question: null, level: null}
    }
  },
  computed: {
    questions() {
      return this.$store.getters.getQuestions
    },
    questionAreas() {
      return this.$store.getters.getMaturityQuestionAreas
    },
    questionLevels() {
      return this.$store.getters.getMaturityQuestionLevels
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showAgileMaturity') {
        this.showAgileMaturity = false
      }
    })
  },
  methods: {
    setShowAgileMaturity(val) {
      this.showAgileMaturity = val
      if (val) {
        bus.$emit('openEditPane', 'showAgileMaturity')
      }
    },
    addQuestion() {
      const area = document.getElementById('question-new-area').value
      const title = document.getElementById('question-new-title').value
      const question = {
        title: title,
        area: area,
        levels: this.questionLevels
      }
      bus.$emit('sendAddQuestion', {appType: 'Agile Maturity', question: question})
    },
    deleteQuestion(question) {
      if (confirm('Delete question ' + question.order)) {
        bus.$emit('sendDeleteQuestion', {id: question.id})
      }
    },
    toggleInclude(question) {
      const include = !question.include
      bus.$emit('sendUpdateQuestionInclude', {id: question.id, include: include})
    },
    setEditingQuestionTitle(question) {
      this.editingQuestionTitle = question.id
    },
    setEditingQuestionLevel(question, level) {
      this.editingQuestionLevel = {question: question.id, level: level}
    },
    editingLevel(question, level) {
      return this.editingQuestionLevel.question == question.id && this.editingQuestionLevel.level == level
    },
    saveQuestionTitle() {
      const title = document.getElementById('question-title-editing-' + this.editingQuestionTitle).value
      bus.$emit('sendUpdateQuestionTitle', {id: this.editingQuestionTitle, value: title})
      this.editingQuestionTitle = null
    },
    saveQuestionLevel() {
      const level = document.getElementById('question-level-editing-' + this.editingQuestionLevel.question + '-' + this.editingQuestionLevel.level).value
      bus.$emit('sendUpdateQuestionLevel', {id: this.editingQuestionLevel.question, level: this.editingQuestionLevel.level, value: level})
      this.editingQuestionLevel = {question: null, level: null}
    }
  }
}
</script>

<style lang="scss">
  .questions-table {
    width: 100%;
    margin: 0 auto;

    .title {
      font-weight: bold;
      font-size: larger;
    }

    table {
      &.question-holder-table {
        border-width: 0;
      }

      &.question-table {
        min-width: 500px;
      }
    }

    th {
      text-align: center;
      padding: 2px 6px;
    }

    td {
      table {
        margin: 0;
      }

      &.inline {
        div {
          display: inline-block;
        }
      }

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

      textarea {
        width: 100%;
      }
    }
  }
</style>
