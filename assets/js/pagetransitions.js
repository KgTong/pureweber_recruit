var PageTransitions = (function() {
  var $main = $( '#pt-main' ),
    $pages = $main.children( 'div.pt-page' ),
    pagesCount = $pages.length,
    current = 0,
    isAnimating = false,
    endCurrPage = false,
    endNextPage = false,
    animEndEventNames = {
      'WebkitAnimation' : 'webkitAnimationEnd',
      'OAnimation' : 'oAnimationEnd',
      'msAnimation' : 'MSAnimationEnd',
      'animation' : 'animationend'
    },
    startX, startY, endX, endY

    // animation end event name
    animEndEventName = animEndEventNames[ Modernizr.prefixed( 'animation' ) ],
    // support css animations
    support = Modernizr.cssanimations;

  function init() {
    $pages.each( function() {
      var $page = $( this );
      $page.data( 'originalClassList', $page.attr( 'class' ) );
    } );

    $pages.eq( current ).addClass( 'pt-page-current' );


    document.addEventListener('touchstart', function(ev) {
      startX = ev.touches[0].pageX,
      startY = ev.touches[0].pageY
    }, false)

    document.addEventListener('touchmove', function(ev) {
      ev.preventDefault();
    }, false);

    document.addEventListener('touchend', touchend, false)
  }

  function touchend(e) {
      if( isAnimating ) {
        return false;
      }

      endX = e.changedTouches[0].pageX
      endY = e.changedTouches[0].pageY

      var dir = getSlideDir(startX, startY, endX, endY)

      switch(dir) {
        case 0:
          return
          break
        case 1:
          nextPage(dir)
          break
        case 2:
          nextPage(dir);
          break
      }
  }

  function getSlideAngle(x, y) {
    return Math.atan2(y, x) * 180 / Math.PI
  } 

  function getSlideDir(startX, startY, endX, endY) {
    var dy = endY - startY,
        dx = endX - startX,
        dir = 0

    // if the distance is too short
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
      return dir
    }

    var angle = getSlideAngle(dx, dy)

    if (angle >= 45 && angle < 135) {
      dir = 1
    }else if(angle > -135 && angle <= -45) {
      dir = 2
    }
    return dir 
  }

  function nextPage(dir) {

    if( isAnimating ) {
      return false;
    }

    var $currPage = $pages.eq( current );

    if (dir === 1) {
      if( current > 0  ) {
        --current
      }else {
        return
      }
    }else if (dir === 2) {
      if( current < pagesCount - 1) {
        ++current;
      }
      else {
        return
      }
    }
    
    isAnimating = true;


    var $nextPage = $pages.eq( current ).addClass( 'pt-page-current' ),
      outClass = '', inClass = '';

    switch(dir) {

      case 1:
        outClass = 'pt-page-moveToBottom pt-page-ontop'
        inClass = 'pt-page-scaleUp'
        break;
      case 2:
        outClass = 'pt-page-moveToTop pt-page-ontop'
        inClass = 'pt-page-scaleUp'
        break;
    }

    $currPage.addClass( outClass ).on( animEndEventName, function() {
      $currPage.off( animEndEventName );
      endCurrPage = true;
      if( endNextPage ) {
        onEndAnimation( $currPage, $nextPage );
      }
    } );

    $nextPage.addClass( inClass ).on( animEndEventName, function() {
      $nextPage.off( animEndEventName );
      endNextPage = true;
      if( endCurrPage ) {
        onEndAnimation( $currPage, $nextPage );
      }
    } );

    if( !support ) {
      onEndAnimation( $currPage, $nextPage );
    }
  }

  function onEndAnimation( $outpage, $inpage ) {
    endCurrPage = false;
    endNextPage = false;
    resetPage( $outpage, $inpage );
    isAnimating = false;
  }

  function resetPage( $outpage, $inpage ) {
    $outpage.attr( 'class', $outpage.data( 'originalClassList' ) );
    $inpage.attr( 'class', $inpage.data( 'originalClassList' ) + ' pt-page-current' );
  }

  init();

  return { init : init };
})();
