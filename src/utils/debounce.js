export default debounce = (fn, delay = 500) => {
    let timerId;
    return (...args) => {
        if (timerId)
            clearTimeout(timerId)
        timerId = setTimeout(() => fn.apply(null, args), delay)
    }
}

