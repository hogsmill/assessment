<template>
  <select :id="'dysfunction-' + id">
    <option value="">
      -- Select --
    </option>
    <option v-for="(dysfunction, index) in dysfunctions" :key="index">
      {{ dysfunction }}
    </option>
  </select>
</template>

<script>
export default {
  props: [
    'id'
  ],
  data() {
    return {
      dysfunctions: [
        'Absence of Trust',
        'Fear of Conflict',
        'Lack of Commitment',
        'Avoidance of Accountability',
        'Inattention to Results'
      ]
    }
  }
}
</script>
