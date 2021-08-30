<script>
import bus from '../../../../socket.js'

import { Line } from 'vue-chartjs'

export default {
  extends: Line,
  mounted() {
    bus.$on('showGraph', (data) => {
      console.log('graph data', data)
      this.renderChart(data.chartdata, data.options)
    })
  }
}
</script>
