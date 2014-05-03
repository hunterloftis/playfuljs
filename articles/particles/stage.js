;(function(window) {
  var stage, renderer, width, height;

  stage = new PIXI.Stage(0x111111);
  renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, null, false, true);

  document.body.appendChild(renderer.view);
  requestAnimFrame(animate);

  document.addEventListener(screenfull.raw.fullscreenchange, onResize);
  document.addEventListener('click', function() {
    screenfull.request(renderer.view);
  });

  window.stage = stage;
  window.renderer = renderer;

  function onResize() {
    if (screenfull.isFullscreen) {
      width = screen.width;
      height = screen.height;
    }
    else {
      width = window.innerWidth;
      height = window.innerHeight;
    }
    renderer.resize(width, height);
  }

  function animate() {
    requestAnimFrame(animate);
    renderer.render(stage);
  }
})(window);
