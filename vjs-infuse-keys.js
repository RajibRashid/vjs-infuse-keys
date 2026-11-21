// see README for more details

/*
  custom keyboard shortcuts when focused on video
    → - (right arrow) step forward 30 seconds     // was: forward 10 seconds
    ← - (left arrow) step backwards 15 seconds    // was: reverse 10 seconds
    ↑ - (up arrow) load previous video            // was: volume up 
    ↓ - (down arrow) load next video              // was: volume down 
    . - jump to next chapter                      // was: hide/show scene scrubber
    , - jump to previous chapter                  // was: hide/show sidebar
    ] - jump forward 10%                          // was: volume up
    [ - jump backwards 10%                        // was: volume down
    c - activate/ deactivate captions
    0 - seek to start of video
*/

// declarations
let player;

wfke("video-js", init);

const seekVideo = (seconds = 0) => {
  const curTime = player.currentTime();
  const newTime = curTime + seconds;
  player.currentTime(newTime);
}

const seekPercent = (percent = 0) => {
  const duration = player.duration();
  if (!Number.isFinite(duration) || duration <= 0) return;

  const curTime = player.currentTime();
  const offset = duration * percent;
  const newTime = Math.max(0, Math.min(duration, curTime + offset));
  player.currentTime(newTime);
};

const toggleCaptions = () => {
  const track = player.textTracks().tracks[0];
  track.mode = track.mode == "showing" ? "hidden" : "showing";
};

const adjustVolume = (delta = 0) => {
  const currentVol = player.volume();
  // Round to 2 decimal places and clamp between 0 and 1
  const newVol = Math.max(0, Math.min(1, Math.round((currentVol + delta) * 100) / 100));

  if (delta > 0 && player.muted()) {
    player.muted(false);
  }

  player.volume(newVol);
};

const isTyping = (target) => {
  if (!target) return false;
  const tag = target.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target.isContentEditable;
};

// intercept keydown in the capture phase (runs before Stash's mousetrap handlers)
function handleKey(evt) {
  // do not run if no active player exists or if user is typing in a text box
  if (!player || player.isDisposed?.() || isTyping(evt.target)) return;

  const key = evt.key;

  // right arrow - step forward 60 seconds
  if (key == "ArrowRight" && !evt.ctrlKey && !evt.altKey) {
    seekVideo(30);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // left arrow - step backward 30 seconds
  else if (key == "ArrowLeft" && !evt.ctrlKey && !evt.altKey) {
    seekVideo(-15);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // up arrow - load previous video
  else if (key == "ArrowUp") {
    player.skipButtons().onPrevious();
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // down arrow - load next video
  else if (key == "ArrowDown" || key == "/") {
    player.skipButtons().onNext();
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // . - scrub forward 10% of video duration (mimics ])
  else if (key === "." && !evt.ctrlKey && !evt.altKey) {
    seekPercent(0.05);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
  // , - scrub backward 10% of video duration (mimics [)
  else if (key === "," && !evt.ctrlKey && !evt.altKey) {
    seekPercent(-0.05);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // c - toggle captions
  else if (key == "c") {
    toggleCaptions();
    evt.preventDefault();
    evt.stopImmediatePropagation();
  } // home | 0 - seek to start of video
  if (key == "Home" || key == "0") {
    player.currentTime(0);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }  // [ - volume down (-10%)
  else if (key === "[" && !evt.ctrlKey && !evt.altKey) {
    adjustVolume(-0.1);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
  // ] - volume up (+10%)
  else if (key === "]" && !evt.ctrlKey && !evt.altKey) {
    adjustVolume(0.1);
    evt.preventDefault();
    evt.stopImmediatePropagation();
  }
}

// register the DOM listener ONCE in capture phase
document.addEventListener("keydown", handleKey, true);

// called on navigation; waits for <video-js> to actually mount
function init() {
  player = null;

  // wait until scene info is loaded
  wfke(".scene-file-info", () => { return true; });

  // since we waited for "video-js" event, object should be ready
  player = document.querySelector("video-js").player;
  if (!player) {
    console.error("[vjs-infuse-keys] unable to find vjs player");
    return false;
  }

  document.dispatchEvent(new CustomEvent("vjs-infuse-keys:ready", { "detail": { player } }));
  console.log("[vjs-infuse-keys] initialization complete");
}
PluginApi.Event.addEventListener("stash:location", () => wfke("video-js", init));
