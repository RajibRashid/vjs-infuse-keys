// see README for more details

/*
  custom keyboard shortcuts when focused on video
    . - step forward 30 seconds         // was: hide/show scene scrubber
    , - step backwards 15 seconds       // was: hide/show sidebar
    ] - jump to next chapter
    [ - jump to previous chapter
    c - activate/ deactivate captions   // was: volume down
    0 - seek to start of video
    v - (down arrow) load next video 
    ^ - (up arrow) load previous video  // was: volume up 
*/

// declarations
let player, framestep;
let markers = [];

wfke("video-js", init);

// get all candidates, find the one that contains "fps"
const getFrameRate = () =>
  [...document.querySelectorAll(".scene-file-info dd")]
    .find((candidate) => candidate.innerText.includes("fps"))
    .textContent.split(" ")[0];

const toggleCaptions = () => {
  const track = player.textTracks().tracks[0];
  track.mode = track.mode == "showing" ? "hidden" : "showing";
}

const navMarker = (next = true) => {
  const curTime = player.currentTime();
  const marker = next
    ? markers.find(marker => marker > curTime)
    : markers.toReversed().find(marker => marker < curTime-5)
  if (marker) player.currentTime(marker);
}

const seek = (seconds = 0) => {
  const curTime = player.currentTime();
  const newTime = curTime + seconds;
  player.currentTime(newTime);
}

function handleKey(evt) {
  const key = evt.key;
  // home | 0 - seek to start of video
  if (key == "Home" || key == "0") {
    player.currentTime(0);
    evt.preventDefault();
  }
  // . (>) - step forward 30 seconds
  else if (key == "." && !evt.ctrlKey && !evt.altKey) {
    seek(30);
    evt.preventDefault();
  } // , (<) - step backward 15 seconds
  else if (key == "," && !evt.ctrlKey && !evt.altKey) {
    seek(-15);
    evt.preventDefault();
  } // [ - jump to previous marker
  else if (key == "]" && markers.length) {
    navMarker(true);
  } // ] - jump to next marker
  else if (key == "[" && markers.length) {
    navMarker(false);
  } // c - toggle captions
  else if (key == "c") {
    toggleCaptions();
  } // home | 0 - seek to start of video
  if (key == "Home" || key == "0") {
    player.currentTime(0);
    evt.preventDefault();
  } // down arrow - load next video
  else if (key == "ArrowDown" || key == "/") {
    player.skipButtons().onNext();
    evt.preventDefault();
  }
  // up arrow - load previous video
  else if (key == "ArrowUp") {
    player.skipButtons().onPrevious();
    evt.preventDefault();
  }
}

// setup constances when video-js is loaded
function init() {
  player = document.querySelector("video-js").player;
  player.on("keydown", handleKey);
  // once scene info is loaded, get framerate
  wfke(".scene-file-info", () => framestep = 1 / getFrameRate());
  // parse markers once they have been added
  wfke(".vjs-marker, .vjs-marker-range", () => {
    markers = player.markers().markers.map((marker) => marker.seconds);
  });
  document.dispatchEvent(new CustomEvent("vjs-shortcut:ready", { "detail": { player } }));
}
PluginApi.Event.addEventListener("stash:location", () => wfke("video-js", init))
