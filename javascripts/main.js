$(function(){

  /* cookie notice */
    $('.cookie-notice').addClass('open');
    $('.cookie-btns a').on('click', function(){
      $('.cookie-notice').removeClass('open');
      $('.cookie-notice').hide();
    });

  /* header */
  $(window).scroll(function(){
  if ($(window).scrollTop() >= 50) {
    $('.header').css('top','0');
}});

  $('.burger').on('click', function(){
    $('.header').addClass('open');
    $('.mob-menu').addClass('open');
    $('.burger').hide();
    $('.close-img').show();
  })
  $('.close-img').on('click', function(){
    $('.header').removeClass('open')
    $('.mob-menu').removeClass('open');
    $('.close-img').hide();
    $('.burger').show();
  })
  $('.header.open a').on('click', function(){
    $('.header').removeClass('open')
  })

  $('.mob-menu .dropbtn').on('click', function(){
    $(this).parent('.dropdown').toggleClass('active');
    $(this).next('.dropdown-content').toggleClass('active');
  })


  $('.mob-menu .dropdown-content .menu-item').on('click', function(){
    $(this).children('.column-item').addClass('active')
  })
  //
  // $('.menu-item.submenu').hover(function(){
  //   $('.dropdown-content').toggleClass('active')
  // });
  $('.search-icon').on('click', function(){
    $('.header-search').toggleClass('open')
  })


  /* hero carousel */


  $('.hero-items').slick({
    infinite: true,
  	dots: true,
  	arrows: false,
  	autoplay: false,
  	autoplaySpeed: 3000,
    video: true
  });
  //
  // On slide change, pause all videos
  $('.hero-items').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    $('video').each(function() {
      $(this).get(0).pause();
    });
  });

  var slideWrapper = $(".hero-items"),
      iframes = slideWrapper.find('.embed-player'),
      lazyImages = slideWrapper.find('.slide-image'),
      lazyCounter = 0;

  // POST commands to YouTube or Vimeo API
  function postMessageToPlayer(player, command){
    if (player == null || command == null) return;
    player.contentWindow.postMessage(JSON.stringify(command), "*");
  }

  // When the slide is changing
  function playPauseVideo(slick, control){
    var currentSlide, slideType, startTime, player, video;

    currentSlide = slick.find(".slick-current");
    slideType = currentSlide.attr("class").split(" ")[1];
    player = currentSlide.find("iframe").get(0);
    startTime = currentSlide.data("video-start");

    if (slideType === "youtube") {
      switch (control) {
        case "play":
          postMessageToPlayer(player, {
            "event": "command",
            "func": "mute"
          });
          postMessageToPlayer(player, {
            "event": "command",
            "func": "playVideo"
          });
          break;
        case "pause":
          postMessageToPlayer(player, {
            "event": "command",
            "func": "pauseVideo"
          });
          break;
      }
    } else if (slideType === "video") {
      video = currentSlide.children("video").get(0);
      if (video != null) {
        if (control === "play"){
          video.play();
        } else {
          video.pause();
        }
      }
    }
  }

  // Resize player
  function resizePlayer(iframes, ratio) {
    if (!iframes[0]) return;
    var win = $(".hero-items"),
        width = win.width(),
        playerWidth,
        height = win.height(),
        playerHeight,
        ratio = ratio || 16/9;

    iframes.each(function(){
      var current = $(this);
      if (width / ratio < height) {
        playerWidth = Math.ceil(height * ratio);
        current.width(playerWidth).height(height).css({
          left: (width - playerWidth) / 2,
           top: 0
          });
      } else {
        playerHeight = Math.ceil(width / ratio);
        current.width(width).height(playerHeight).css({
          left: 0,
          top: (height - playerHeight) / 2
        });
      }
    });
  }

  // DOM Ready
  $(function() {
    // Initialize
    slideWrapper.on("init", function(slick){
      slick = $(slick.currentTarget);
      setTimeout(function(){
        playPauseVideo(slick,"play");
      }, 1000);
      resizePlayer(iframes, 16/9);
    });
    slideWrapper.on("beforeChange", function(event, slick) {
      slick = $(slick.$slider);
      playPauseVideo(slick,"pause");
    });
    slideWrapper.on("afterChange", function(event, slick) {
      slick = $(slick.$slider);
      playPauseVideo(slick,"play");
    });
    slideWrapper.on("lazyLoaded", function(event, slick, image, imageSource) {
      lazyCounter++;
      if (lazyCounter === lazyImages.length){
        lazyImages.addClass('show');
        // slideWrapper.slick("slickPlay");
      }
    });

    //start the slider
    slideWrapper.slick({
      // fade:true,
      autoplaySpeed:4000,
      lazyLoad:"progressive",
      speed:600,
      arrows:false,
      dots:true,
      cssEase:"cubic-bezier(0.87, 0.03, 0.41, 0.9)"
    });
  });

  // Resize event
  $(window).on("resize.slickVideoPlayer", function(){
    resizePlayer(iframes, 16/9);
  });


})
