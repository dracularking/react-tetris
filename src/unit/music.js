import store from '../store';

// 使用 Web Audio API
const AudioContext = (
  window.AudioContext ||
  window.webkitAudioContext ||
  window.mozAudioContext ||
  window.oAudioContext ||
  window.msAudioContext
);

// && location.protocol.indexOf('http') !== -1
const hasWebAudioAPI = {
  data: !!AudioContext,
};


const music = {};

(() => {
  if (!hasWebAudioAPI.data) {
    return;
  }
  const url = '/music.mp3'; // 改为绝对路径确保正确引用
  const context = new AudioContext();
  const req = new XMLHttpRequest();
  req.open('GET', url, true);
  req.responseType = 'arraybuffer';

  req.onload = () => {
    console.log('音乐文件加载成功');
    context.decodeAudioData(req.response, (buf) => { // 将拿到的audio解码转为buffer
      const getSource = () => { // 创建source源。
        const source = context.createBufferSource();
        source.buffer = buf;
        source.connect(context.destination);
        return source;
      };

      music.killStart = () => { // 游戏开始的音乐只播放一次
        music.start = () => {};
      };

      music.start = () => { // 游戏开始
        music.killStart();
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 3.7202, 3.6224);
      };

      music.clear = () => { // 消除方块
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 0, 0.7675);
      };

      music.fall = () => { // 立即下落
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 1.2558, 0.3546);
      };

      music.gameover = () => { // 游戏结束
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 8.1276, 1.1437);
      };

      music.rotate = () => { // 旋转
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.2471, 0.0807);
      };

      music.move = () => { // 移动
        if (!store.getState().get('music')) {
          return;
        }
        getSource().start(0, 2.9088, 0.1437);
      };
    },
    (error) => {
      console.error('音乐文件解码失败:', error);
      if (window.console && window.console.error) {
        window.console.error(`音频: ${url} 读取错误`, error);
        hasWebAudioAPI.data = false;
      }
    });
  };

  req.send();
})();

module.exports = {
  hasWebAudioAPI,
  music,
};

