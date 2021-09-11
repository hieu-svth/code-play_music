const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const player = $('.player')
const cd =  $('.cd');
const cdThumb =  $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const PLAYER_STORAGE_KEY = 'F8_PLAYER'


/*
1. Render Song
2. Scroll Top
3. Play/ Pause/ Seek 
4. CD rotate
5. Next / prev
6. Random 
7. Next/ Repeat when ended
8. Active song 
9. Scroll active song into view 
10. Play song when click
*/

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
          name: "Bad Habits",
          singer: "Ed Sheeran",
          path: "./asset/music/song 1.mp3",
          image: "./asset/image/images1.jpeg"
        },
        {
          name: "Let Her Go",
          singer: "Raftaar x Salim Merchant x Karma",
          path: "./asset/music/song 2.mp3",
          image:
            "./asset/image/images2.jpeg"
        },
        {
          name: "See You Again",
          singer: "Raftaar x Brobha V",
          path:
            "./asset/music/song 3.mp3",
          image: "./asset/image/images3.jpeg"
        },
        {
          name: "Stronger",
          singer: "Raftaar x Nawazuddin Siddiqui",
          path: "./asset/music/song 4.mp3",
          image:
            "./asset/image/images4.jpeg"
        },
        {
          name: "Unstoppable",
          singer: "Raftaar",
          path: "./asset/music/song 5.mp3",
          image:
            "./asset/image/images5.jpeg"
        },
        {
          name: "Wating For Love",
          singer: "Raftaar x kr$na",
          path:
            "./asset/music/song 6.mp3",
          image:
            "./asset/image/images6.jpeg"
        },
        {
          name: "Walk Thru Fire",
          singer: "Raftaar x Harjas",
          path: "./asset/music/song 7.mp3",
          image:
            "./asset/image/images7.jpeg"
        },
        {
          name: "My Love",
          singer: "Raftaar x Harjas",
          path: "./asset/music/song 8.mp3",
          image:
            "./asset/image/images8.jpeg"
        },
        {
          name: "Take Me To Your Heart",
          singer: "Raftaar x Harjas",
          path: "./asset/music/song 9.mp3",
          image:
            "./asset/image/images9.jpeg"
        }
    ],
    setConfig: function(key, value) {
      this.config[key] = value;
      localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        var htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex? 'active': ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML= htmls.join('');
    },
    defineProperties: function() {
      Object.defineProperty(this, 'currentSong', {
        get: function() {
          return this.songs[this.currentIndex]
        }
      })
    },
    handleEvent: function() {
      const _this = this
      const cdWidth = cd.offsetWidth;

      // Xử lý CD quay / dừng 
       const cdThumbAnimate = cdThumb.animate([
        { transform: 'rotate(360deg)'}
      ], {
        duration: 10000, // 10 giây
        iterations: Infinity,
      })
      cdThumbAnimate.pause();

      // Xử lý phóng to thu nhỏ CD
      document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
      cd.style.opacity = newCdWidth / cdWidth;
      }

      // Xử lý khi click play
      playBtn.onclick = function() {
        if (_this.isPlaying) {
          audio.pause()
        }else {
          audio.play()
        }
      }
      // Khi song được play 
      audio.onplay = function() {
        _this.isPlaying = true
        player.classList.add('playing')
        cdThumbAnimate.play();
      } 
      // Khi song bị pause 
      audio.onpause = function() {
        _this.isPlaying = false
        player.classList.remove('playing')
        cdThumbAnimate.pause();
      } 

      // Khi tiến độ bài hát thay đổi 
      audio.ontimeupdate = function() { // sự kiện khi một bài hát thay đổi time 
        if(audio.duration) {
          const progressPercent = Math.floor(audio.currentTime/ audio.duration * 100)// currenttime return số time hiện tại,  duration return tổng số time của bài hát 
          progress.value = progressPercent
        }
      }

      // Xử lý khi tua song 
      progress.oninput = function(e) {
        const seekTime = audio.duration / 100 * e.target.value
        audio.currentTime = seekTime // currentTime có thể set có thể get giá trị 
      }

      // Khi next bài hát 
      nextBtn.onclick = function() {
        if (_this.isRandom) {
        _this.playRandomSong()
        } else{
          _this.nextSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // Khi prev bài hát 
      prevBtn.onclick = function() {
        if (_this.isRandom) {
          _this.playRandomSong()
        } else{
            _this.prevSong()
        }
        audio.play()
        _this.render()
        _this.scrollToActiveSong()
      }

      // Khi random bật tắt 
      randomBtn.onclick = function() {
        _this.isRandom = !_this.isRandom
        _this.setConfig('isRandom', _this.isRandom)
        randomBtn.classList.toggle('active', _this.isRandom)
      }
      
      // Xử lý khi bật tắt repeattpggle
      repeatBtn.onclick = function() {
        _this.isRepeat = !_this.isRepeat
        _this.setConfig('isRepeat',  _this.isRepeat)
        repeatBtn.classList.toggle('active', _this.isRepeat)
      }
      // Xử lý next song khi ended
      audio.onended = function() {
        if(_this.isRepeat) {
          audio.play()
        }else{
          nextBtn.click() // mô phỏng việc khi tự nó click vào btn chuyển sang bài khác 
        }
      }
      
      // Lắng nghe hành vi click vào playlist 
      playlist.onclick = function(e) {
        const songNode = e.target.closest('.song:not(.active)')
        if (songNode || e.target.closest('.option')) {  // khi click vào con  thì cha cũng ảnh hưởng 
        // xử lý khi click vòa song
          
          if(songNode) {
            _this.currentIndex = Number(songNode.dataset.index)
            _this.loadCurrentSong() 
            _this.render()
            audio.play()
            console.log(songNode.dataset.index) // lấy ra index để chuyển bài hát
          }
          // khi click vào song options
        }
      }
    },
    scrollToActiveSong: function () {
      setTimeout(() => {
        $(".song.active").scrollIntoView({
          behavior: "smooth",
          block: "end"
        });
      }, 200);
    },
    loadCurrentSong: function() {
      heading.textContent = this.currentSong.name
      cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
      audio.src = this.currentSong.path
    },
    loadConfig: function() {
      this.isRandom = this.config.isRandom,
      this.isRandom = this.config.isRepeat
    },
    nextSong: function() {
      this.currentIndex++ 
      if(this.currentIndex >= this.songs.length) {
        this.currentIndex = 0
      }
      this.loadCurrentSong()
    },
    prevSong: function() {
      this.currentIndex--
      if(this.currentIndex < 0) {
        this.currentIndex = this.songs.length - 1 // trả về phần tử cuối mảng 
      }
      this.loadCurrentSong()
    },
    playRandomSong: function() {
      let newIndex
      do {
        newIndex = Math.floor(Math.random() * this.songs.length)
      }while(newIndex === this.currentIndex)
      this.currentIndex = newIndex
      this.loadCurrentSong()
    },
    start: function() {
      // Gắn cấu hình từ Config vào ứng dụng 
      this.loadConfig();
      // Định nghĩa các thuộc tính cho Object
      this.defineProperties();

      //Lắng nghe và xử lý các sự kiện (DOM events)
      this.handleEvent();


      // tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
      this.loadCurrentSong();

      //Render playlist
      this.render();

      // Hiển thị trạng thái ban đầu của button repeat & random
      randomBtn.classList.toggle('active', this.isRandom)
      repeatBtn.classList.toggle('active', this.isRepeat)
    }
}
app.start();
