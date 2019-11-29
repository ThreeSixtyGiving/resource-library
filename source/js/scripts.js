// @ts-nocheck
$(document).ready(function () {

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
      const cardItem = $(el).children('.resource-card')
      const cardItemFilters = getFilters(cardItem[0], 'resource-card--')
      const cardHeading = cardItem.find('.resource-card__heading')
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
      $('.resource-card--expanded').removeClass('resource-card--expanded') // closes expanded card if any
      isotope.arrange() // triggers isotope filtering
    })
  })

  $('.js-search-filter').keyup(function (event) {
    $('.resource-card--expanded').removeClass('resource-card--expanded') // closes expanded card if any
    isotope.arrange() // triggers isotope filtering
  })

  // Cards
  $('.resource-card').each(function () {
    const card = $(this)
    const cardContent = card.children('.resource-card__content')
    card.click(function () {
      if (!card.hasClass('resource-card--expanded')) {
        $('.resource-card--expanded').removeClass('card--expanded')
      } else {
        window.history.pushState({}, null, window.location.origin)
      }
      card.toggleClass('resource-card--expanded')
      if (cardContent[0].hasAttribute('aria-hidden')) {
        cardContent.removeAttr('aria-hidden')
        const cardTitle = card.find('h3')
        window.history.pushState({}, null, window.location.origin + '#' + cardTitle[0].id)
      } else {
        cardContent.attr('aria-hidden', '')
      }
      isotope.layout() // triggers isotope rendering since elements' height have been changed
    })
  })


}); // doc.ready
