<script>
import bus from '../../../../socket.js'

//import { Line } from 'vue-chartjs'

export default {
  // extends: Line,
  computed: {
    questions() {
      return this.$store.getters.getQuestionsInclude
    }
  },
  mounted() {
    bus.on('showGraph', (data) => {
      data.chartdata.datasets = this.setIncluded(data.chartdata.datasets)
      this.renderChart(data.chartdata, data.options)
    })
  },
  methods: {
    setIncluded(datasets) {
      const data = []
      for (let i = 0; i < datasets.length; i++) {
        const dataset = datasets[i]
        const include = this.questions.find((q) => {
          return q.question == dataset.label
        })
        if (!include || include.include) {
          data.push(dataset)
        }
      }
      return data
    }
  }
}
</script>
