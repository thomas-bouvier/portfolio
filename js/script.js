var containerEl = document.querySelector('.min-container');
var mixer = mixitup(containerEl);

particlesJS.load('particles-js', './js/particles/particlesjs-config.json', function() {
  console.log('callback - particles.js config loaded');
});
