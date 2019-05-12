const throttle = (method: Function, duration: number, context: object) => {
  var timeId;
  var previous;
  return (...args) => {
    let now = +new Date();
    clearTimeout(timeId);
    if (!previous || now - previous > duration) {
      method(...args);
      previous = now;
    } else {
      timeId = setTimeout(() => {
        method(...args);
        previous = +new Date();
      }, duration);
    }
  }
};

export default throttle;
