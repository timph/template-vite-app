export default function debounce(fn, delay = 500) {
    let timerId;
    return (...args) => {
        clearTimeout(timerId)
        timerId = setTimeout(() => fn.apply(null, args), delay)
    }
}

