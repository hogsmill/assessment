
const colors = [
  'red',
  'blue',
  'green',
  'purple',
  'orange',
  'black',
  'cyan',
  'teal',
  'brown',
  'olive',
  'pink',
  'yellow',
  'gray',
  'khaki',
  'lime',
  'chocolate',
  'darkslategray',
  'goldenrod'
]

export default {

  dataset: function(n) {
    return {
      backgroundColor: colors[n],
      pointBackgroundColor: colors[n],
      borderWidth: 1,
      pointBorderColor: colors[n],
      data: [],
      radius: 5,
      hitRadius: 10,
      fill: 'none',
      borderWidth: 3,
      borderColor: colors[n],
      label: ''
    }
  },

  config: function() {
    return {
      average: 0,
      data: {
        labels: [],
        datasets: []
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1,
              callback: function(label, index, labels) {
                return label
              }
            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        elements: {
          line: {
            tension: 0
          }
        },
        legend: {
          display: true
        },
        responsive: true,
        maintainAspectRatio: false
      }
    }
  }
}
