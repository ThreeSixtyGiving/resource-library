// @ts-nocheck
$(document).ready(function () {

  var x = $('.smartlink')
  
  $.each(x, function(i, val) {
    var ref = $(this);
    var ref_top = ref.offset().top;
    var ref_id = ref.attr('class').slice(-3); // this needs to be more robust

    var content_top = $('.prose__content').offset().top;

    var text_ref = $('.smartlink-content--' + ref_id );
    text_ref.css({top: ref_top - content_top });
  });

  $('.smartlink').click(function(){
    var ref_id = $(this).attr('class').slice(-3);
    $('.smartlink-content--' + ref_id ).toggleClass('js-active');
  });

  // Smooth Scrolling Function
  $('a[href*=#]:not([href=#])').click(function () {
      var $targ = $(this.hash),
          host1 = this.hostname,
          host2 = location.hostname,
          path1 = this.pathname.replace(/^\//, ''),
          path2 = location.pathname.replace(/^\//, '');

      if (!$targ.length) {
          $targ = $('[name=' + this.hash.slice(1) + ']');
      }

      if ($targ.length && (host1 === host2 || path1 === path2)) {
          $('html, body').animate({ scrollTop: $targ.offset().top }, 1000);

          return false;
      }

      return true;
  });


  $('.js-submit').click(function() {
    $('.js-modal').addClass('js-active');
    $('.js-overlay').addClass('js-active');
  });
  
  $('.js-overlay').click(function() {
    $('.js-modal').removeClass('js-active'); // FIX ME!!!
    $(this).removeClass('js-active'); // FIX ME!!!
    $('.js-result').removeClass('js-active');
  });

  $('.js-comment-trigger').click(function() {
    $('.js-result').addClass('js-active'); // FIX ME!!!
  });

  
  // $( '.fullscreen-section:in-viewport( 100 )' ).addClass('fullscreen-section--in-viewport');

  // $(window).scroll(function() {
  //   $( '.fullscreen-section' ).removeClass('fullscreen-section--in-viewport');
  //   $( '.fullscreen-section:in-viewport( 100 )' ).addClass('fullscreen-section--in-viewport');
  // });

  // window.sr = ScrollReveal();
  
  // sr.reveal('.fadein');
  // sr.reveal('.fadein--from-right', { duration: 1400 });

  try {
    if (ScrollReveal) {
      window.sr = ScrollReveal({ 
        reset: false,
        duration: 1200, 
        distance: '20px',
        scale: 0.95,
        viewFactor: 0.3,
        delay: 50
      });
  
      sr.reveal('.fadein--from-right', { origin: 'right' });
      sr.reveal('.fadein--from-left', { origin: 'left' });
      sr.reveal('.fadein--from-bottom', { origin: 'bottom' });
      sr.reveal('.fadein--from-top', { origin: 'top' });
    }
  } catch {}
  
  // 360RL

  // Menu
  $('.top-bar__menu-trigger, .off-canvas-menu__trigger').click(function () {
    const offCanvasMenu = $('.off-canvas-menu')
    offCanvasMenu.toggleClass('off-canvas-menu--expanded')
    if (offCanvasMenu[0].hasAttribute('aria-hidden')) {
      offCanvasMenu.removeAttr('aria-hidden')
    } else {
      offCanvasMenu.attr('aria-hidden', '')
    }
  })

  function getFilters(el, prefix) {
    const classes = el.className.split(' ')
    const filters = []
    for (const clazz of classes) {
      if (clazz.startsWith(prefix)) {
        filters.push(clazz.substring(prefix.length))
      }
    }
    return filters
  }

  // Filtering
  const isotope = new Isotope(document.querySelector('.list-section .wrapper'), {
    itemSelector: '.list-section__item',
    layoutMode: 'fitRows',
    filter: (el) => {
      const filteringTags = document.querySelectorAll('.filters .filter--selected')
      const searchInput = ($('.js-search-filter').val() || '').trim()
      const hasFilteringTags = filteringTags.length > 0
      if (!hasFilteringTags && !searchInput) {
        return true
      }
      const cardItem = $(el).children('.card')
      const cardItemFilters = getFilters(cardItem[0], 'card--')
      const cardHeading = cardItem.find('.card__heading')
      const cardItemName = cardHeading && cardHeading.length > 0 ? cardHeading.text() : ''
      let isSearchMatch = true
      if (searchInput && cardItemName) {
        isSearchMatch = cardItemName.toLowerCase().includes(searchInput.toLowerCase())
      }
      if (!hasFilteringTags) {
        return isSearchMatch
      }
      let matchingFilters = 0
      for (const tag of filteringTags) {
        const filters = getFilters(tag, 'filter--')
        for (const cardFilter of cardItemFilters) {
          if (filters.indexOf(cardFilter) !== -1) {
            matchingFilters += 1
          }
        }
      }
      return isSearchMatch && matchingFilters === filteringTags.length
    }
  })

  // Tags
  $('.filter').each(function () {
    const tag = $(this)
    tag.click(function () {
      tag.toggleClass('filter--selected')
      $('.card--expanded').removeClass('card--expanded') // closes expanded card if any
      isotope.arrange() // triggers isotope filtering
    })
  })

  $('.js-search-filter').keyup(function (event) {
    $('.card--expanded').removeClass('card--expanded') // closes expanded card if any
    isotope.arrange() // triggers isotope filtering
  })

  // Cards
  $('.card').each(function () {
    const card = $(this)
    const cardContent = card.children('.card__content')
    card.click(function () {
      if (!card.hasClass('card--expanded')) {
        $('.card--expanded').removeClass('card--expanded')
      }
      card.toggleClass('card--expanded')
      if (cardContent[0].hasAttribute('aria-hidden')) {
        cardContent.removeAttr('aria-hidden')
      } else {
        cardContent.attr('aria-hidden', '')
      }
      isotope.layout() // triggers isotope rendering since elements' height have been changed
    })
  })


}); // doc.ready
