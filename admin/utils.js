// admin/utils.js
// Collection of utility helpers used across admin pages.

function formatCurrency(value, currency = 'USD') {
  const num = Number(value) || 0;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(num);
}

function formatDate(ts) {
  const d = new Date(ts);
  return d.toLocaleString();
}

function debounce(fn, wait = 250) {
  let t;
  return function(...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), wait); };
}

function loadLottie(container, path, options = {}) {
  // Dynamically import lottie-web only when used for faster page load
  return import('lottie-web').then(lottie => {
    const anim = lottie.loadAnimation(Object.assign({
      container: container,
      renderer: 'svg',
      loop: options.loop === undefined ? false : options.loop,
      autoplay: options.autoplay === undefined ? true : options.autoplay,
      path: path
    }, options || {}));
    return anim;
  });
}

export { formatCurrency, formatDate, debounce, loadLottie };
