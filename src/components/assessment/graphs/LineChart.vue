<script>
import bus from '../../../socket.js'

import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  created() {
    bus.$on('showGraph', (data) => {
      console.log('here', data)
      this.renderChart(data.chartdata, data.options)
    })
  }
}
</script>
