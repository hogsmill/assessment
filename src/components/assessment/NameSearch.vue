<template>
  <div class="name-search">
    <input type="text" id="search" @keyup="getData()">
    <div class="search-results">
      <div v-for="(result, index) in results" :key="index" @click="selectName(result)" class="search-result">
        {{ result.name }}
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'

import bus from '../../socket.js'

export default {
  data() {
    return {
      searchId: '',
      results: []
    }
  },
  created() {
    bus.$on('updateSearchResults', (data) => {
      if (data.id == this.searchId) {
        this.results = data.results
      }

    })
  },
  methods: {
    getData() {
      this.searchId = uuidv4()
      const search = document.getElementById('search').value
      if (search.length > 1) {
        bus.$emit('sendGetSearchResults', {id: this.searchId, query: search})
      }
    },
    selectName(name) {
      this.name = name
      this.results = []
      document.getElementById('search').value = name.name
    }
  }
}
</script>

<style lang="scss">
  .name-search {
    position: relative;

    .search-results {
      position: absolute;
      margin-top: 2px;
      border: 1px solid;
      z-index: 10;

      .search-result {
        padding: 0 4px;

        &:hover {
          background-color: #f4511e;
          color: #fff;
        }
      }
    }
  }
</style>
