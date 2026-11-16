# VideoJS Infuse-like keyboard shortcuts

#### This stashapp plugin was created to emulate keyboard shortcuts within ScenePlayer (ie. VideoJS) that I am usually use with Infuse. Note that it changes the existing behavior for several keys

## updated
| key | action | overrides |
|---|---|---|
| ↑ | move to previous video |volume up
| ↓ | move to next video| volume down|
| ← | step backward 30 seconds |step backward 10 seconds
| → | step forward 60 seconds| step forward 10 seconds|
| . | scrub forward 5% of total duration|hide/show scene scrubber |
| , | scrub backward 5% of total duration |hide/show sidebar |
| ] | volume up 10% | scrub forward 10%| 
| [| volume down 10% | scrub backwards 10%|
| c | activate/ deactivate captions | |
| Home | seek to the beginning of the video | |
| 0 | seek to the beginning of the video | |


## existing
- space
- media keys
- k
- m
- 1-9

[videojs shortcuts](https://videojs.com/guides/options/#useractionshotkeys)  
[stash shortcuts](https://docs.stashapp.cc/in-app-manual/keyboardshortcuts/#scene-page-shortcuts)  

## Acknowledgements

This plugin is based on and adapted from the original [`vjs-shortcut`](https://github.com/feederbox826/plugins/tree/main/plugins/vjs-shortcut) plugin created by [feederbox826](https://github.com/feederbox826) as part of the [feederbox826/plugins](https://github.com/feederbox826/plugins) repository.

## License

This project retains the original license from the upstream plugin. See the [LICENSE](./LICENSE) file for details.