
export default {

  config: function() {
    return {
      average: 0,
      data: {
        labels: [],
        datasets: [{
          backgroundColor: '',
          pointBackgroundColor: 'white',
          borderWidth: 1,
          pointBorderColor: '#249EBF',
          data: [],
          pointRadius: 0,
          fill: 'none',
          borderWidth: 3,
          borderColor: 'red',
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {beginAtZero: true, stepSize: 1},
            gridLines: {display: true}
          }],
          xAxes: [{
            gridLines: {display: false}
          }]
        },
        legend: {display: false},
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
