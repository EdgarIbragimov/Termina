class SoundManager {
  constructor() {
    this.clips = {};
    this.context = null;
    this.gainNode = null;
    this.loaded = false;
  }

  init() {
    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.gainNode = this.context.createGain();
      this.gainNode.connect(this.context.destination); // подключение к динамикам
    } catch (e) {
      console.error("Web Audio API is not supported in this browser", e);
    }
  }

  load(path, callback) {
    if (this.clips[path]) {
      callback(this.clips[path]);
      return;
    }
    let clip = { path: path, buffer: null, loaded: false };
    this.clips[path] = clip;
    let request = new XMLHttpRequest();
    request.open("GET", path, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
      this.context
        .decodeAudioData(request.response)
        .then((buffer) => {
          clip.buffer = buffer;
          clip.loaded = true;
          callback(clip);
        })
        .catch((e) => console.error(`Error decoding audio data: ${e}`));
    };
    request.onerror = () => {
      console.error(`Error loading audio file: ${path}`);
    };
    request.send();
  }

  loadArray(array) {
    let loadPromises = array.map((path) => {
      return new Promise((resolve, reject) => {
        this.load(path, (clip) => {
          resolve(clip);
        });
      });
    });

    Promise.all(loadPromises).then(() => {
      this.loaded = true;
    });
  }

  play(path, settings) {
    if (!this.loaded) {
      setTimeout(() => this.play(path, settings), 1000);
      return;
    }
    let looping = false;
    let volume = 1;
    if (settings) {
      if (settings.looping) looping = settings.looping;
      if (settings.volume) volume = settings.volume;
    }
    let sd = this.clips[path];
    if (sd === null) return false;
    let sound = this.context.createBufferSource();
    sound.buffer = sd.buffer;
    sound.connect(this.gainNode);
    sound.loop = looping;
    this.gainNode.gain.value = volume;
    sound.start(0);
    return true;
  }

  setVolume(volume) {
    this.volume = volume;
    this.gainNode.gain.value = this.volume;
  }
}

const soundManager = new SoundManager();
