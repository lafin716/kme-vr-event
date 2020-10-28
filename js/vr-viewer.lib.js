var call = 0;

function VR_Viewer(params) {

    // Default options
    var defaults = {
        playable : false,
        autoPlay : false,
        draggable : false,
        mouseMove : false,
        buttons : false,
        touches : false,
        keys : false,
        scroll : false
    };

    // Options Assign
    var options = Object.assign(defaults, params);

    // Variables setting
    var id = options.id;
    var n = options.n;
    var p = options.p;
    var t = options.t;
    var playable = options.playable;
    var autoPlay = options.autoPlay;
    var draggable = options.draggable;
    var mouseMove = options.mouseMove;
    var buttons = options.buttons;
    var keys = options.keys;
    var touches = options.touches;
    var scroll = options.scroll;
    var frame_buttons = options.frame_buttons;


    // console.log(`${call}-${id}-${playable ? 'playable ' : ''}${autoPlay ? 'autoPlay ' : ''}${draggable ? 'draggable ' : ''}${mouseMove ? 'mouseMove ' : ''}${buttons ? 'buttons ' : ''}${keys ? 'keys' : ''}${scroll ? 'scroll ' : ''}${frame_buttons ? 'frame_buttons ' : ''}`);
    call++;
    loaderNone(id);

    var i = 1;
    var j = 0;
    var move = [];
    var mainDiv = document.querySelector(`#${id}`);

    // 시작 프레임 설정
    if(options.frame_buttons && options.frame_buttons.start_sector){
        i = options.frame_buttons.sector[options.frame_buttons.start_sector - 1];
    }

    mainDiv.className = 'viewer';
    mainDiv.innerHTML += `<img class="${id} ${playable ? 'playable ' : ''}${autoPlay ? 'autoPlay ' : ''}${draggable ? 'draggable ' : ''}${mouseMove ? 'mouseMove ' : ''}${buttons ? 'buttons ' : ''}${keys ? 'keys ' : ''}${scroll ? 'scroll ' : ''}${frame_buttons ? 'frame_buttons ' : ''}" draggable="false" src='${p}${i}.${t}'>`;
    mainDiv.innerHTML +=
           '<div class="loader"><div class="three-bounce"><div class="one"></div><div class="two"></div><div class="three"></div></div></div>'

    if (call == 1){
        for (var k = 1; k <= n; k++) {
            document.getElementById('dummy').innerHTML += `<img src='${p}${k}.${t}'>`;
        }
    }

    var img = document.querySelector(`#${id} .${id}`);

    if (!playable && !autoPlay) {
        var touch = false;

        if(touches){
            (window.matchMedia("screen and (max-width: 992px)").matches) ? touchFun() : nonTouch();

            //For Touch Devices
            window.addEventListener('touchstart', function () {
                touchFun();
            });
        }

        function touchFun() {
            touch = true;
            img.removeAttribute('draggable');
            img.addEventListener('touchmove', function (e) {
                logic(this, e);
            });
            img.addEventListener('touchend', function (e) {
                move = [];
            });
        }
        //For Non-Touch Devices
        function nonTouch() {
            touch = false;
            if (draggable) {
                var drag = false;
                img.addEventListener('mousedown', function (e) {
                    drag = true;
                    logic(this, e);
                });
                img.addEventListener('mouseup', function (e) {
                    drag = false;
                    move = [];
                });
                mouseEvent();
            }

            if (mouseMove) {
                drag = true;
                mouseEvent();
            }
            function mouseEvent() {
                img.addEventListener('mousemove', function (e) {
                    (drag) ? logic(this, e) : null;
                });
                img.addEventListener('mouseleave', function () {
                    move = [];
                });
            }
            if (scroll) {
                img.addEventListener('wheel', function (e) {
                    e.preventDefault();
                    (e.wheelDelta / 120 > 0) ? nxt(this) : prev(this);
                });
            }
            if (keys) {
                img.setAttribute('tabindex', '0');
                img.onkeydown = function (e) {
                    e.preventDefault();
                    if (e.keyCode == 37 || e.keyCode == 38)
                        prev(img);
                    else if (e.keyCode == 39 || e.keyCode == 40)
                        nxt(img);
                };
            }
        }
        function logic(el, e) {
            j++;
            var x = touch ? e.touches[0].clientX : e.clientX;
            var coord = (x - img.offsetLeft);
            move.push(coord);

            var l = move.length,
                oldMove = move[l - 2],
                newMove = move[l - 1];
            var thresh = touch ? true : !(j % 3);
            if (thresh) {
                if (newMove > oldMove)
                    nxt(el);
                else if (newMove < oldMove)
                    prev(el);
            }
        }
        if (buttons) {
            var btnsDiv = document.createElement('div');
            btnsDiv.className = 'btnDiv navDiv';

            var leftNavBtn = document.createElement('button');
            leftNavBtn.className = 'play leftNav';
            leftNavBtn.setAttribute('title', 'left navigation');
            btnsDiv.appendChild(leftNavBtn);
            leftNavBtn.addEventListener('click', function () {
                prev(img);
            });

            var rightNavBtn = document.createElement('button');
            rightNavBtn.className = 'play rightNav';
            rightNavBtn.setAttribute('title', 'right navigation');
            btnsDiv.appendChild(rightNavBtn);
            rightNavBtn.addEventListener('click', function () {
                nxt(img);
            });
            img.parentNode.appendChild(btnsDiv);
        }

        if (frame_buttons) {
            var navigation_wrap = document.querySelector(frame_buttons.selector);
            var frame_index = options.frame_buttons.start_sector ? options.frame_buttons.start_sector - 1 : 0;
            var frame_count = frame_buttons.sector.length;
            var nav_text = frame_buttons.navText;
            var duration = 50;
            var btnsDiv = document.createElement('div');
            btnsDiv.className = 'navFrameDiv';

            // callback
            var callback = null;
            if(frame_buttons.pages){
                callback = function(frame_index){
                    var pages = document.querySelectorAll(frame_buttons.pages);
                    for(var i=0; i<pages.length; i++){

                        if(i == frame_index){
                            pages[i].classList.remove('hide');
                        }else{
                            pages[i].classList.add('hide');
                        }
                    }
                };
            }

            var leftNavBtn = document.createElement('i');
            leftNavBtn.className = 'navLeft fas fa-angle-left';
            leftNavBtn.setAttribute('title', 'left navigation');
            btnsDiv.appendChild(leftNavBtn);
            leftNavBtn.addEventListener('click', function () {
                if(frame_index > 0 && !frame_running){
                    frame_prev(frame_buttons.sector[frame_index - 1], duration, callback);
                    --frame_index;
                }
            });

            var middleNavText = document.createElement('span');
            middleNavText.className = 'navText';
            middleNavText.setAttribute('title', 'left navigation');
            middleNavText.innerText = nav_text;
            btnsDiv.appendChild(middleNavText);

            var rightNavBtn = document.createElement('i');
            rightNavBtn.className = 'navRight fas fa-angle-right';
            rightNavBtn.setAttribute('title', 'right navigation');
            btnsDiv.appendChild(rightNavBtn);
            rightNavBtn.addEventListener('click', function () {
                if(frame_index < frame_count - 1 && !frame_running){
                    frame_next(frame_buttons.sector[frame_index + 1], duration, callback);
                    ++frame_index;
                }
            });
            navigation_wrap.appendChild(btnsDiv);
        }


    } else {
        var interval, playing = false,
            pause = false,
            left = false,
            right = false,
            speed = 50;

        if (playable) {
            var btnDiv = document.createElement('div');
            btnDiv.className = 'btnDiv';

            var playBtn = document.createElement('button');
            playBtn.className = 'play';
            playBtn.setAttribute('title', 'play');
            btnDiv.appendChild(playBtn);
            playBtn.addEventListener('click', function () {
                playing = true;
                pause = false;
                play();
            });

            var pauseBtn = document.createElement('button');
            pauseBtn.className = 'pause';
            pauseBtn.setAttribute('title', 'pause');
            btnDiv.appendChild(pauseBtn);
            pauseBtn.addEventListener('click', function () {
                pause = true;
            });

            var stopBtn = document.createElement('button');
            stopBtn.className = 'stop';
            stopBtn.setAttribute('title', 'stop');
            btnDiv.appendChild(stopBtn);

            stopBtn.addEventListener('click', function () {
                pause = true;
                speed = 50;
                right = true;
                left = false;
                this.parentNode.parentNode.querySelector('img').src = `${p}${i = 1}.${t}`;
            });

            var leftBtn = document.createElement('button');
            leftBtn.className = 'left';
            leftBtn.setAttribute('title', 'play direction-left');
            btnDiv.appendChild(leftBtn);
            leftBtn.addEventListener('click', function () {
                right = false;
                left = true;
                if (playing)
                    play();
            });

            var rightBtn = document.createElement('button');
            rightBtn.className = 'right';
            rightBtn.setAttribute('title', 'play direction-right');
            btnDiv.appendChild(rightBtn);
            rightBtn.addEventListener('click', function () {
                left = false;
                right = true;
                if (playing)
                    play();
            });

            var speedBtn = document.createElement('button');
            speedBtn.className = 'plus';
            speedBtn.setAttribute('title', 'increase play speed');
            btnDiv.appendChild(speedBtn);
            speedBtn.addEventListener('click', function () {
                if (playing)
                    timer(speed > 10 ? speed -= 10 : speed);
            });

            var slowBtn = document.createElement('button');
            slowBtn.className = 'minus';
            slowBtn.setAttribute('title', 'decrease play speed');
            btnDiv.appendChild(slowBtn);
            slowBtn.addEventListener('click', function () {
                if (playing)
                    timer(speed < 100 ? speed += 10 : speed);
            });

            mainDiv.prepend(btnDiv);
        }

        function play() {
            timer(speed);
        }

        function timer(t) {
            clearInterval(interval);
            interval = setInterval(function () {
                if (!pause) {
                    if (left)
                        prev(img);
                    else if (right)
                        nxt(img);
                    else
                        nxt(img);
                }
            }, t);
        }
    }

    
    var frame_running = false;
    function frame_prev(sector_index, duration, callback){
        if(frame_running) return false;
        frame_running = true;
        interval = setInterval(function () {

            if(i <= sector_index) {
                clearInterval(interval);
                callback(frame_index);
                frame_running = false;
            }else{
                prev(img);
            }
        }, duration);
    }

    function frame_next(sector_index, duration, callback){
        if(frame_running) return false;
        frame_running = true;
        interval = setInterval(function () {
            
            if(i >= sector_index){
                clearInterval(interval);
                callback(frame_index);
                frame_running = false;
            }else{
                nxt(img);
            }
        }, duration);
    }

    function prev(e) {
        if (i <= 1) {
            i = n;
            e.src = `${p}${--i}.${t}`;
            nxt(e);
        } else
            e.src = `${p}${--i}.${t}`;
    }
    function nxt(e) {
        if (i >= n) {
            i = 1;
            e.src = `${p}${++i}.${t}`;
            prev(e);
        } else
            e.src = `${p}${++i}.${t}`;
    }
    function loaderNone(id) {
        window.addEventListener('load',function(){
            document.querySelector(`#${id} .loader`).style.display = 'none';
            if (autoPlay) {
                pause = false;
                play();
            }
        });
    }
}
