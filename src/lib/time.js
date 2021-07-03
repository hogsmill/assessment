
const Time = {

  format: function(t) {
    let minutes = parseInt(t / 60)
    let seconds = t - (minutes * 60)
    if (minutes < 10) { minutes = '0' + minutes }
    if (seconds < 10) { seconds = '0' + seconds }
    return minutes + ':' + seconds
  }
}

export default Time
