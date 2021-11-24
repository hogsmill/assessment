<template>
  <table class="facilitator-table departments-table">
    <tr>
      <td colspan="2">
        <h4>Departments</h4>
        <i v-if="showDepartments" @click="setShowDepartments(false)" title="collapse" class="fas fa-caret-up toggle" />
        <i v-if="!showDepartments" @click="setShowDepartments(true)" title="expand" class="fas fa-caret-down toggle" />
      </td>
    </tr>
    <tr v-if="showDepartments">
      <td>
        <input type="text" id="new-department">
        <button class="btn btn-sm btn-secondary smaller-font" @click="addDepartment()">
          Add New
        </button>
      </td>
    </tr>
    <tr v-if="showDepartments">
      <td>
        <table>
          <thead>
            <tr>
              <th>
                Actions
              </th>
              <th>
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(department, index) in departments" :key="index">
              <td>
                <div class="actions">
                  <i class="fas fa-trash-alt enabled" :title="'Delete ' + department.name" @click="deleteDepartment(department)" />
                  <i v-if="editingDepartment != department.id" class="fas fa-edit" @click="setEditingDepartment(department)" />
                  <i v-if="editingDepartment == department.id" class="fas fa-save" @click="saveDepartmentName(department)" />
                </div>
              </td>
              <td>
                <div class="department-name">
                  <span v-if="editingDepartment != department.id">{{ department.name }}</span>
                  <input v-if="editingDepartment == department.id" type="text" :id="'department-name-editing-' + department.id" :value="department.name">
                </div>
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
      showDepartments: false,
      editingDepartment: null
    }
  },
  computed: {
    departments() {
      return this.$store.getters.getDepartments
    }
  },
  created() {
    bus.$on('openEditPane', (data) => {
      if (data != 'showDepartments') {
        this.showDepartments = false
      }
    })
  },
  methods: {
    setShowDepartments(val) {
      this.showDepartments = val
      if (val) {
        bus.$emit('openEditPane', 'showDepartments')
      }
    },
    addDepartment() {
      const name = document.getElementById('new-department').value
      bus.$emit('sendAddDepartment', {name: name})
    },
    deleteDepartment(department) {
      if (confirm('Delete ' + department.name)) {
        bus.$emit('sendDeleteDepartment', {id: department.id})
      }
    },
    setEditingDepartment(department) {
      this.editingDepartment = department.id
    },
    saveDepartmentName() {
      const name = document.getElementById('department-name-editing-' + this.editingDepartment).value
      bus.$emit('sendUpdateDepartmentName', {id: this.editingDepartment, name: name})
      this.editingDepartment = null
    }
  }
}
</script>

<style lang="scss">
  .departments-table {
    width: 100%;

    th {
      text-align: center;
      padding: 2px 6px;
    }

    td {
      &.center {
        text-align: center;
      }

      .actions {
        width: 100px;
        text-align: center;

        .fas {
          margin: 2px 2px;
        }
      }

      .department-name {
        width: 200px;
      }
    }
  }
</style>
