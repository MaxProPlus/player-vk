class TimeFormatter {
  // Перевод секунд в формат mm:ss
  public static secondToTime = (second: number): string => {
    let time = Math.floor(second / 60) + ':'
    if (Math.floor(second % 60) < 10) {
      return time + '0' + Math.floor(second % 60)
    } else {
      return time + Math.floor(second % 60)
    }
  }
}

export default TimeFormatter