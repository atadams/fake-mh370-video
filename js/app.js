const Pannable = (elViewport) => {
  // video dimensions: 6122 x 2866
  // MaxX = 6122/2 - 241 - (1280/2) = 2180
  // MinX = 6122/2 - 4549 - (1280/2) = -2128
  // MaxY = 2866/2 - 257 - (720/2) = 816
  // MinY = 2866/2 - 1659 - (720/2) = -586

  const elCanvas = elViewport.firstElementChild;
  const start = {x: 0, y: 0};
  const offset = {x: 1898, y: 816}; // The transform offset (from center)
  const offsetLimits = {MaxX: 2180, MinX: -2128, MaxY: 816, MinY: -586};

  const elLat = document.getElementById("lat");
  const elLon = document.getElementById("long");
  const coordsStart = {lat: 8.834301, lon: 93.19492};
  const lonPerPixel = 0.010933 / 4308;
  const latPerPixel = 0.027588 / 1402;

  elCanvas.style.translate = `${offset.x}px ${offset.y}px`;
  let isPan = false;

  const panStart = (ev) => {
    ev.preventDefault();
    isPan = true;
    start.x = ev.clientX - offset.x;
    start.y = ev.clientY - offset.y;
  };

  const panMove = (ev) => {
    if (!isPan) return; // Do nothing
    offset.x = ev.clientX - start.x;
    offset.y = ev.clientY - start.y;

    // keep the offset within the limits
    if (offset.x < offsetLimits.MinX) offset.x = offsetLimits.MinX;
    if (offset.x > offsetLimits.MaxX) offset.x = offsetLimits.MaxX;
    if (offset.y < offsetLimits.MinY) offset.y = offsetLimits.MinY;
    if (offset.y > offsetLimits.MaxY) offset.y = offsetLimits.MaxY;

    elCanvas.style.translate = `${offset.x}px ${offset.y}px`;

    elLat.textContent = parseFloat((coordsStart.lat - offset.y * latPerPixel).toFixed(6));
    elLon.textContent = parseFloat((coordsStart.lon + offset.x * lonPerPixel).toFixed(6));
    console.log(offset.x, offset.y);
  };

  const panEnd = () => {
    isPan = false;
  };

  elViewport.addEventListener("pointerdown", panStart);
  addEventListener("pointermove", panMove);
  addEventListener("pointerup", panEnd);
};

const elSatelliteVideo = document.getElementById("satellite-video");

// when #replay-button is clicked, play #satellite-video video from the beginning
document.getElementById("replay-button").addEventListener("click", () => {
  elSatelliteVideo.currentTime = 0;
  elSatelliteVideo.play();
});

document.querySelectorAll(".viewport").forEach(Pannable);
