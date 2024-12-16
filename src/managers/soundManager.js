class SoundManager {
  constructor() {
    this.clips = {};
    this.context = null;
    this.gainNode = null;
    this.loaded = false;
    this.volume = localStorage.getItem('gameVolume') ? 
      parseFloat(localStorage.getItem('gameVolume')) : 0.5;
  }

  init() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = this.volume;
  }

  load(path, callback) {
    if (this.clips[path]) {
      callback(this.clips[path]);
      return;
    }

    const clip = { path: path, buffer: null, loaded: false };
    clip.play = (volume, options) => {
      this.play(path, options);
    };
    this.clips[path] = clip;

    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      this.context.decodeAudioData(request.response, 
        (buffer) => {
          clip.buffer = buffer;
          clip.loaded = true;
          callback && callback(clip);
        },
        (error) => {
          console.error('Error with decoding audio data' + error);
        }
      );
    };
    request.send();
  }

  loadArray(array) {
    array.forEach((path) => {
      this.load(path, () => {
        if (Object.values(this.clips).every(clip => clip.loaded)) {
          this.loaded = true;
        }
      });
    });
  }

  play(path, options = {}) {
    if (!this.loaded) return;
    
    const clip = this.clips[path];
    if (!clip || !clip.loaded) return;

    const source = this.context.createBufferSource();
    source.buffer = clip.buffer;
    source.connect(this.gainNode);
    source.loop = options.looping || false;
    
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
    
    source.start(0);
    return source;
  }

  setVolume(value) {
    this.volume = value;
    this.gainNode.gain.value = value;
    localStorage.setItem('gameVolume', value);
  }

  stopAll() {
    this.gainNode.disconnect();
    this.gainNode = this.context.createGain();
    this.gainNode.connect(this.context.destination);
    this.gainNode.gain.value = this.volume;
  }
}

const soundManager = new SoundManager();
