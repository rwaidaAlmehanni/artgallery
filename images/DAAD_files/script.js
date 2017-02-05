currentNavItem = null;

$('ul#site.nav > li').hover(
  function(){ $("div", this).show(); },
  function(){ $("div", this).hide(); }
);

$('#international-sites select').focus(function(){
    $(this).parents('#international-sites div.outer').addClass('keepOpen');
});
$('#international-sites select').blur(function(){
    $(this).parents('#international-sites div.outer').removeClass('keepOpen');
});
$(document).ready(function() {
    $('#international-sites select').change(function() {
        if (this.value) {
            var sitename = $(this).children('option[value="'+this.value+'"]').attr('data-countername')
                        .toLowerCase()
                        // remove special characters in sitename for valid countername
                        .replace(/[^a-z]/g, '')
            ;
            ns_onclick(this, '', 'onclick.link.' + sitename, 'clickout');
            window.location.href = this.value;
        }
    });
});

$('.collapsable > *:first-child').click(function() {
  collapseBlock = $(this).parent();
  isExpanded = collapseBlock.hasClass('expanded');
  if (isExpanded) {
    collapseBlock.removeClass('expanded');
  } else {
    collapseBlock.addClass('expanded');
  }
});

function daadFancyboxFormatTitle(title, currentArray, currentIndex, currentOpts) {
  html  = '<div id="tip7-title">';
  imageDescription = title.split('©')[0];
  imageCopyright = title.split('©')[1];
  html += (imageDescription && imageDescription.length ? '<p class="description">' + imageDescription + '</p>' : '' );
  html += (imageCopyright && imageCopyright.length ? '<p class="copyright">© ' + imageCopyright + '</p>' : '' );
  if (currentArray.length > 1) {
    html += '<p class="counter">' + (currentIndex + 1) + '/' + currentArray.length + '</p>';
  }
  html += '</div>';
  return html;
}

$(".gallery li a").fancybox({
  titlePosition: 'inside',
  centerOnScroll: true,
  titleFromAlt: true,
  titleFormat: daadFancyboxFormatTitle,
  cyclic: true
});

$("div.daadaddresses span.wrap").css('display', 'none');
$("div.daadaddresses ul.addresses li > a").click(function() {
    var wrap = $('#'+$(this).attr('rel'));
    if (wrap.css('display') == 'none') {
        wrap.slideDown('slow');
    } else {
        wrap.css('display', 'none');
    }

    return false;
});


$('ul.worldmap li a, ul.largeworldmap li a').tooltip({
    track: true,
    delay: 0,
    showURL: false,
    showBody: " - ",
    extraClass: "shadow",
    fixPNG: true,
    opacity: 0.95,
    top: -35,
    left: 0
});

$('#content a.tooltip').tooltip({
    track: true,
    delay: 0,
    showURL: false,
    showBody: " - ",
    extraClass: "shadow",
    fixPNG: true,
    opacity: 0.95,
    top: -35,
    left: 0
});

$('div.InfoBoxSwitcher .divMainContentInfoboxContent').css('display', 'none');
$('div.InfoBoxSwitcher h4').click(function() {
    var collapseBlock = $(this).parent();
    collapseBlock.find('.divMainContentInfoboxContent').each(function() {
        $(this).toggle('slow');
    });
});



// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
function log(){
  log.history = log.history || [];   // store logs to an array for reference
  log.history.push(arguments);
  arguments.callee = arguments.callee.caller;
  if(this.console) console.log( Array.prototype.slice.call(arguments) );
}
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});

if ($('.downloadcenter #filter-table').length > 0) {
    scrollStart = $('#filter-table').offset().top;
    $(window).scroll(function () {
        if(window.pageYOffset >= scrollStart) {
            $('#filter-table').addClass('fixedtop');
        } else {
            $('#filter-table').removeClass('fixedtop');
        }
    });
}

$( document ).ready(function() {
    "use strict";

    // initialize bx-slider
    if ($('.homeslider').length) {

        var numSlides = $('.homeslider li').length;

        if(numSlides >= 2) {
            $('.homeslider').bxSlider({
                auto: true,
                slideWidth: 948,
                autoControls: true,
                speed: 1000,
                autoControlsCombine: true,
                pause: 8000,
                autoHover: true,
                nextSelector: '#slider-next',
                prevSelector: '#slider-prev',
                adaptiveHeight: true,
                nextText: 'vor',
                prevText: 'zurück',
                onSliderLoad: function (currentIndex) {
                    $( "#slider-prev" ).prependTo( $( "#slider .bx-wrapper" ) );
                    $( "#slider-next" ).prependTo ( $( "#slider .bx-controls" ) );
                    $('.homeslider>li').eq(currentIndex + 1).addClass('active-slide');
                    $('.active-slide .caption').fadeTo(1000, 1);
                    $('.slide a').attr('tabindex', '-1');
                    $('.active-slide .slide a:first-child').attr('tabindex', '0');
                    $('.bx-clone .slide a').attr('tabindex', '-1');
                    $('.bx-pager-item a').attr('tabindex', '-1');
                },
                onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                    $('.active-slide').removeClass('active-slide');
                    $('.caption').fadeTo(300, 0);
                    $('.homeslider>li').eq(newIndex + 1).addClass('active-slide');
                    $('.bx-clone').addClass('active-slide');
                    $('.active-slide .caption').fadeTo(1000, 1);
                    $('.slide a').attr('tabindex', '-1');
                    $('.active-slide .slide a:first-child').attr('tabindex', '0');
                    $('.bx-clone .slide a').attr('tabindex', '-1');
                },
                onSlideAfter: function () {
                    $('.bx-clone').removeClass('active-slide');
                }
            });
        } else {
            $('.homeslider').bxSlider({
                auto: false,
                slideWidth: 948,
                autoControls: false,
                speed: 1000,
                autoControlsCombine: false,
                pause: 8000,
                autoHover: true,
                nextSelector: '#slider-next',
                prevSelector: '#slider-prev',
                adaptiveHeight: true,
                nextText: 'vor',
                prevText: 'zurück',
                pager: false,
                controls: false,
                onSliderLoad: function (currentIndex) {
                    $( "#slider-prev" ).prependTo( $( "#slider .bx-wrapper" ) );
                    $( "#slider-next" ).prependTo ( $( "#slider .bx-controls" ) );
                    $('.homeslider>li').eq(currentIndex + 1).addClass('active-slide');
                    $('.active-slide .caption').fadeTo(1000, 1);
                    $('.slide a').attr('tabindex', '-1');
                    $('.active-slide .slide a:first-child').attr('tabindex', '0');
                    $('.bx-clone .slide a').attr('tabindex', '-1');
                    $('.bx-pager-item a').attr('tabindex', '-1');
                },
                onSlideBefore: function ($slideElement, oldIndex, newIndex) {
                    $('.active-slide').removeClass('active-slide');
                    $('.caption').fadeTo(300, 0);
                    $('.homeslider>li').eq(newIndex + 1).addClass('active-slide');
                    $('.bx-clone').addClass('active-slide');
                    $('.active-slide .caption').fadeTo(1000, 1);
                    $('.slide a').attr('tabindex', '-1');
                    $('.active-slide .slide a:first-child').attr('tabindex', '0');
                    $('.bx-clone .slide a').attr('tabindex', '-1');
                },
                onSlideAfter: function () {
                    $('.bx-clone').removeClass('active-slide');
                }
            });
        }

    }

    // initialize alumni-slider
    if ($('.alumnislider').length) {
        $('.alumnislider').each(function() {
            if ($(this).find('li').length > 1) {
                $(this).bxSlider({
                    slideWidth: 300,
                    auto: false,
                    pager: false,
                    autoControls: false,
                    adaptiveHeight: true,
                    infiniteLoop: true,
                    nextText: 'vor',
                    prevText: 'zurück',
                });
            }
        });
    }

    // initialize the megamenu
    if ($('.nav-menu').length) {

        var megadropdownLayer = $(".megadropdown-layer"),
            navigation = $("nav:first"),
            navItem = $(navigation).find(".nav-item"),
            navMenu = $(navigation).find(".nav-menu"),
            BodyHeight = $("body").height();

        $(megadropdownLayer).css("height", BodyHeight);

        $(navigation).accessibleMegaMenu({
            uuidPrefix: "megamenu",
            menuClass: "nav-menu",
            topNavItemClass: "nav-item",
            panelClass: "sub-nav",
            panelGroupClass: "sub-nav-group",
            hoverClass: "hover",
            focusClass: "focus",
            openClass: "open",
            panelDelay: 500
        });

        var pathname = window.location.pathname;
        pathname = pathname.replace(/^\/|\/$/g, '');

        var pathArray = pathname.split('/');

        var layer1 = pathArray[0];
        var layer2 = pathArray[1];
        var layer3 = pathArray[2];
        var layer4 = pathArray[3];
        var lastEl = pathArray[pathArray.length-1];

        var classToCheck = '.nav-menu .'+layer1+' > .'+lastEl
        var menuItemExists = $(classToCheck).length;

        if(menuItemExists) {

            var currentElement = '.'+layer1+' .'+lastEl;
            alert(currentElement);
            $(currentElement).addClass('active');
            $(currentElement).parent().parent().addClass('active');

            var wrapper = $(currentElement).closest('.nav-item');
            wrapper.addClass('active');

            var lang = $('html').attr('lang');

            if(lang == 'de') {
                wrapper.prepend('<span class="sr-only">Aktueller Pfad: </span>');
                $(currentElement).prepend('<span class="sr-only">Aktuelle Seite: </span>');
            } else {
                wrapper.prepend('<span class="sr-only">Current Path: </span>');
                $(currentElement).prepend('<span class="sr-only">Current Page: </span>');
            }

        } else {
            var elemLayerOne = $('#mainnavigation > .'+layer1);
            var elemLayerTwo = elemLayerOne.find('.'+layer2);
            var elemLayerThree = elemLayerTwo.find('.'+layer3);
            var elemLayerFour = elemLayerThree.find('.'+layer4);

            if (pathArray.length == 1) {
                elemLayerOne = $('#mainnavigation > .nav-item:first-child');
            }

            elemLayerOne.addClass('active');
            elemLayerTwo.addClass('active');
            elemLayerThree.addClass('active');
            elemLayerFour.addClass('active');

            var lang = $('html').attr('lang');

            if(lang == 'de') {
                elemLayerOne.prepend('<span class="sr-only">Aktueller Pfad: </span>');
                elemLayerTwo.prepend('<span class="sr-only">Aktueller Pfad: </span>');
                elemLayerThree.prepend('<span class="sr-only">Aktuelle Seite: </span>');
                elemLayerFour.prepend('<span class="sr-only">Aktuelle Seite: </span>');
            } else {
                elemLayerOne.prepend('<span class="sr-only">Current Path: </span>');
                elemLayerTwo.prepend('<span class="sr-only">Current Path: </span>');
                elemLayerThree.prepend('<span class="sr-only">Current Page: </span>');
                elemLayerFour.prepend('<span class="sr-only">Current Page: </span>');
            }

        }

        // Only darkened layer if nav item has subnav
        $(megadropdownLayer).hide();

        $(navItem).on("mouseenter", function () {
            currentNavItem = this;
            setTimeout(function() {
                var menueIsOpen = $(currentNavItem).find("a").hasClass('open');
                var menueHasSubnav = $(currentNavItem).find("a").attr("aria-haspopup");

                if (menueIsOpen && menueHasSubnav) {
                        $(megadropdownLayer).fadeIn(300);
                        $(navMenu).addClass("on");
                } else {
                    $(megadropdownLayer).hide();
                    $(navMenu).removeClass("on");
                }
            }, 550);
        });

        $(navItem).on("mouseleave", function () {

            var menueHasSubnav = $(this).find("a").attr("aria-haspopup");

            if (menueHasSubnav) {
            } else {
                $(megadropdownLayer).hide();
                $(navMenu).removeClass("on");
            }
        });

        $(navigation).on("mouseleave", function () {
            var menueHasSubnav = $(this).find("a").attr("aria-haspopup");
            if (menueHasSubnav) {
                $(megadropdownLayer).fadeOut(300);
                $(navMenu).removeClass("on");
            } else {
                $(megadropdownLayer).hide();
                $(navMenu).removeClass("on");
            }

        });
    }

    // Change Delete Button on active state - css class (change-on-active)
    // generic hover function for inline images
    var changeOnActive = $(".change-on-active");
    if ($(changeOnActive).length) {

        $(changeOnActive).on("mouseenter focus",function () {

            var src = $(this).attr("src");
            var test = src.search(/_hover/);
            if (test > 0) {
                $(this).attr("src", function(index, attr){
                    return attr.replace("_hover.png", ".png");
                });
            }

            $(this).attr("src", function(index, attr){
                return attr.replace(".png", "_hover.png");
            });

        }).on("mouseleave focusout",function () {
            $(this).attr("src", function(index, attr){
                return attr.replace("_hover.png", ".png");
            });
        });
    }

    /* Tooltip */
    var tooltip = $(".tooltip-info");
    if ($(tooltip).length) {
        $(tooltip).tooltip(options);
    }

    /* Teaser event: Bootstrap collapse events */
    /* on showing details, hide details button */
    var teaserListEventDetails = $(".teaser-list-event-details");
    var teaserListEventMore = $(".teaser-list-event-more");

    if ($(teaserListEventDetails).length) {
        $(teaserListEventDetails).on('show.bs.collapse', function () {
            $(teaserListEventDetails)
                .removeClass("in");

            $(teaserListEventMore)
                .removeClass("sr-only");

            $(this)
                .prev()
                .addClass("sr-only");
        });
    }
});


if ($(".hochschulen-projektfoerderungen").length > 0) {
    options = {
        checkAllText: 'Alle auswählen',
        uncheckAllText: 'Auswahl aufheben',
        noneSelectedText: 'Bitte wählen Sie',
        selectedText: '# ausgewählt',
        selectedList: 1
    };

    $("#aktionsfeld").multiselect(options);
    $("#herkunft").multiselect(options);
    $("#zland").multiselect(options);
    $("#status").multiselect(options);

    $(".searchbox label").tooltip();
}

// Teaser Filter Accordion: default initialization
var teaserFilterWidget = $(".teaser-filter-widget");
if ($(teaserFilterWidget).length) {
    var icons = {
        header: "acc-widget-icon-plus",
        activeHeader: "acc-widget-icon-minus"
    };
    $(teaserFilterWidget).accordion({
        icons: icons,
        collapsible: true,
        heightStyle: "content",
        active: false
    });

    // Open Current Filter-Box
    var filterActive = $(teaserFilterWidget).find('.acc-widget-list-item-delete');
    var toOpen = parseInt(filterActive.parent().parent().parent().attr('rel'));
    $(teaserFilterWidget).accordion({ active: toOpen });

    // Scroll to accordion if clicked (#22784)
    $(teaserFilterWidget).find('.acc-widget-header').on('click', function() {
        // Only scroll if accordion is going to be opened (#22447)
        if ($(this).hasClass('ui-accordion-header-active')) {
            // Scroll to accordion headline once accordion is open (#22769)
            $(teaserFilterWidget).on('accordionactivate', function(event, ui) {
                $('html, body').animate({ scrollTop: $(ui.newHeader).offset().top }, 300);
            });
        }
    });
}

$('.filter-addresses .acc-widget-link').click(function(e){
    var toShow = $(this).attr('href');

    $('.filter-addresses .acc-widget-link').removeClass('filtered');
    $(this).addClass('filtered');

    $('#delete-filter').remove();
    $(this).parent().append('<span id="delete-filter">x</span>');

    $('.address-list li').hide();
    $(toShow).fadeIn();

    $('#delete-filter').click(function(e){
        $('.filter-addresses .acc-widget-link').removeClass('filtered');
        $('.address-list li').show();
        $('#delete-filter').remove();
    });
});

var regionalSites = function() {};
regionalSites = {
    regExps: {
        'country': /regionalsites\-country\-([A-Z]{2})/,
        'language': /regionalsites\-language\-([a-z]{3})/
    },
    text: {
        'matches': {
            0: {
                'de': '%s Regional-Seiten werden angezeigt.',
                'en': '%s regional sites are displayed.'
            },
            1: {
                'de': '%s Regional-Seite wird angezeigt.',
                'en': '%s regional site is displayed.'
            }
        }
    },
    initiator: '',
    other: '',
    lang: document.documentElement.lang,

    changed: function(initiator, other) {
        "use strict";

        regionalSites.initiator = initiator;
        regionalSites.other = other;

        var initiatorValue = $('#regional-modal-'+ regionalSites.initiator).val();

        $.each($('#regional-modal-'+ regionalSites.other +' daad-hidden-option'), function(key, el) {
            $(el).replaceWith('<option value="'+ el.getAttribute('value') +'">'+ $(el).html() +'</option>');
        });

        if (initiatorValue != '') {
            $('.region-result').hide();
            $('.regionalsites-'+ regionalSites.initiator +'-'+ initiatorValue).show();

            var visibleSites = $('.region-result:visible');
            regionalSites.visibleSitesOtherValues = new Array('');
            $.each(visibleSites, function(key, address) {
                var classNames = address.className.split(' ');
                $.each(classNames, function(key, className) {
                    var match = regionalSites.regExps[regionalSites.other].exec(className);
                    if (match) {
                        regionalSites.visibleSitesOtherValues.push(match[1]);
                    }
                });
            });

            $.each($('#regional-modal-'+ regionalSites.other +' option'), function(key, el) {
                if ($.inArray($(el).val(), regionalSites.visibleSitesOtherValues) == -1) {
                    $(el).replaceWith('<daad-hidden-option value="'+ $(el).val() +'">'+ $(el).html() +'</daad-hidden-option>');
                }
            });

            if ($('#regional-modal-'+ regionalSites.other +' option').size() === 2) {
                $('#regional-modal-'+ regionalSites.other).prop('selectedIndex', 1);
            }

            regionalSites.htmlUpdateMatches(visibleSites.size());
            $('#no-region-filters').hide();
            $('#region-filters').show();
            $('#region-filter-'+ regionalSites.initiator).show();
            var initiatorSelectBox = document.getElementById('regional-modal-'+ regionalSites.initiator);
            $('#region-filter-'+ regionalSites.initiator +' .value').html(initiatorSelectBox.options[initiatorSelectBox.selectedIndex].text);
        } else {
            $('.region-result').show();
            regionalSites.htmlUpdateMatches($('.regionalsites-url:visible').size());
            $('#region-filters').hide();
            $('#no-region-filters').show();
            $('#region-filter-'+ regionalSites.initiator).hide();

            if ($('#regional-modal-'+ regionalSites.other).val() != '') {
                regionalSites.changed(regionalSites.other, regionalSites.initiator);
            }
        }
    },

    htmlUpdateMatches: function(count) {
        "use strict";

        var counter = (count == 1) ? count : 0;

        $('#regional-modal-num-results').html(regionalSites.text['matches'][counter][regionalSites.lang].replace(/\%s/, count));
    },

    resetAllFilters: function() {
        "use strict";

        $.each($('.regional-sites-modal daad-hidden-option'), function(key, el) {
            $(el).replaceWith('<option value="'+ el.getAttribute('value') +'">'+ $(el).html() +'</option>');
        });

        $('.region-result').show();
        regionalSites.htmlUpdateMatches($('.regionalsites-url:visible').size());
        $('#region-filters').hide();
        $('#no-region-filters').show();
        $('#region-filter-country').hide();
        $('#region-filter-language').hide();
        $('#regional-modal-country').prop('selectedIndex', 0);
        $('#regional-modal-language').prop('selectedIndex', 0);
    }
};

$('#regional-sites-toggle').click(function(e){
    openRegionalModal();
    e.preventDefault();
});

$('.close-regional-modal').click(function(e){
    closeRegionalModal();
    e.preventDefault();
});

$('.megadropdown-layer').click(function(e){
    closeRegionalModal();
    e.preventDefault();
});

function closeRegionalModal() {
    $('.megadropdown-layer').hide();
    $('.regional-sites-modal').hide();
    $('#regional-sites-toggle').focus();
}

function openRegionalModal() {
    $('.megadropdown-layer').show();
    $('.regional-sites-modal').show();
    $('.close-regional-modal').focus();
}

$('#regionalsites-filter-by-language').click(function(e){
    regionalSites.changed('language', 'country');
    e.preventDefault();
});

$('#regionalsites-filter-by-country').click(function(e){
    regionalSites.changed('country', 'language');
    e.preventDefault();
});

$('.regional-sites-modal .delete-filters').click(function(e){
    regionalSites.resetAllFilters();
    e.preventDefault();
});

$('.icon-slider').bxSlider({
    slideWidth: 200,
    minSlides: 1,
    maxSlides: 3,
    slideMargin: 12,
    infiniteLoop: false,
    hideControlOnEnd: true
});

$('.filter-addresses a').smoothScroll();
$('#bottom').smoothScroll();
$('.alphabetical-anchors a').smoothScroll();
$('.alphabetical-anchors a').click(function(){
    var scrollTo = $(this).attr('href');
    $(scrollTo + ' ul li:first-child a').focus();
});

$('.index a').click(function(e){
    e.preventDefault();
    var target = $(this).attr('href');
    var targetName = target.replace('#','');
    var targetElement = $('*[name='+targetName+']');

    $('html, body').animate({
        scrollTop: targetElement.offset().top
    }, 300);

});

$('.page-top').hide();

// Check for Start and Stop Scrolling
var t, l = (new Date()).getTime(), scrolling = false;

$(window).scroll(function()
{
    var now = (new Date()).getTime();

    if (now - l > 400 && !scrolling ){
        $(this).trigger('scrollStart');
        l = now;
    }

    clearTimeout(t);
    t = setTimeout(function() {
        if (scrolling)
            $(window).trigger('scrollEnd');
            checkToTopButton();
    }, 300);
});

function checkToTopButton()
{
    var offset = window.pageYOffset;
    var windowSize = window.innerHeight;

    if (offset >= (windowSize * 0.5)) {
        $('.page-top').fadeIn('fast');
    } else {
        $('.page-top').fadeOut('fast');
    }
}

function initCountryInfosTeaser()
{
    $('.open-country-by-name').submit(function(e) {
        if (!$('#select-country-by-name').val()) {
            alert('Bitte wählen Sie ein Land / Please choose a country');
            e.preventDefault();
        }
    });
}

initCountryInfosTeaser();

/**
 * Alumni Galerie #22501
 */
var alumniGalleryWrapper = '#alumni-gallery';
var alumniGalleryGrid = '#alumni-gallery #portraits';
var alumniGalleryPortraits = $('.portrait img');
var alumniGalleryFilters = {};

// Umsetzung isotope in Kombination mit lazyLoadXT
$(document).ready(function() {
    // Portrait hover
    $(alumniGalleryWrapper+' .portrait.active').live('mouseenter', function() {
        $(this).find('.meta').show();
    }).live('mouseleave', function() {
        $(this).find('.meta').hide();
    });

    if ($(alumniGalleryWrapper).length > 0) {
        // isotope initialisieren
        $(alumniGalleryGrid).isotope({
            itemSelector: '.portrait-wrapper',
            transitionDuration: '0.8s',
            filter: concatValues(alumniGalleryFilters),
        });

        // lazyLoadXT initialisieren
        alumniGalleryPortraits.lazyLoadXT({
            failure_limit: Math.max((alumniGalleryPortraits.length - 1), 0),
            srcAttr: 'data-original',
            selector: '.portrait img',
            updateEvent: 'load orientationchange resize scroll alumniLazy',
            blankImage: '',
        });

        $(alumniGalleryPortraits).on('lazyload', function() {
            $(this).parent('div').addClass('active');
        });

        // Lädt Porträts beim Filtern mit isotope nach
        $(alumniGalleryGrid).isotope('on', 'layoutComplete', function() {
            loadVisibleAlumniPortraits(alumniGalleryPortraits, 'alumniLazy');

            // Aktualisiere die Google Karte beim Filtern
            updateAlumniGoogleMap(this.filteredItems);
        });
    }
});

// Filter Klick
$(alumniGalleryWrapper+' .filter a').click(function(event) {
    // Aktualisiere Filter
    var selection = $(this).parents('ul');
    var filterGroup = $(selection).data('filter-group');
    alumniGalleryFilters[filterGroup] = $(this).data('filter');

    // Aktualisiere Isotope mit Filter
    var filterValue = concatValues(alumniGalleryFilters);
    $(alumniGalleryGrid).isotope({ filter: filterValue });

    // Markiere aktive Filter
    if (filterGroup == 'region') {
        $(alumniGalleryWrapper+' .region-selection .active').removeClass('active');
        $(this).addClass('active');
    } else {
        $(alumniGalleryWrapper+' .type-selection .active').removeClass('active');
        $(this).addClass('active');
    }
});

// Mehr-Button Klick
$(alumniGalleryWrapper+' .more-portraits').click(function(event) {
    $(this).attr('disabled', true);

    // Zähle die aktuelle Seite hoch
    alumniGalleryPage++;

    // Aktualisiere Filter
    var filterGroup = $(this).data('filter-group');
    alumniGalleryFilters[filterGroup] = '.page-'+alumniGalleryPage;

    // Aktualisiere Isotope mit Filter
    var filterValue = concatValues(alumniGalleryFilters);
    $(alumniGalleryGrid).isotope({ filter: filterValue });
});

/**
 * Alumni Vereine #22606
 */
var alumniAssociationsWrapper = '#alumni-associations';
var alumniAssociationsGrid = '#alumni-associations .teaser-filter';

// Standard-Filter
var alumniAssociationsFilters = {};

$(document).ready(function() {
    if ($(alumniAssociationsWrapper).length > 0) {

        $(alumniAssociationsGrid).isotope({
            itemSelector: '.country-wrapper',
            transitionDuration: '0.8s',
            layoutMode: 'vertical',
            vertical: {
                horizontalAlignment: 0,
            }
        });
    }
});

// Filter Klick
$(alumniAssociationsWrapper+' .filter a:not(.disabled)').click(function(event) {
    // Schließe alle Accordions
    $(alumniAssociationsGrid+' .teaser-filter-widget').accordion({
        active: false,
        collapsible: true
    });

    // Aktualisiere Filter
    var selection = $(this).parents('ul');
    var filterGroup = $(selection).data('filter-group');
    alumniAssociationsFilters[filterGroup] = $(this).data('filter');

    // Aktualisiere Isotope mit Filter
    var filterValue = concatValues(alumniAssociationsFilters);
    $(alumniAssociationsGrid).isotope({ filter: filterValue });

    // Markiere aktive Filter
    if (filterGroup == 'region') {
        $(alumniAssociationsWrapper+' .region-selection .active').removeClass('active');
        $(this).addClass('active');
    } else {
        $(alumniAssociationsWrapper+' .countryname-selection .active').removeClass('active');
        $(this).addClass('active');
    }

    // #22769
    // Isotope sieht keine Verwendung mit den jQuery UI Accordions vor,
    // deshalb haben wir einen Workaround mittels CSS umgesetzt,
    // wodurch das Event "layoutComplete" aber nicht mehr ausgeführt wird.
    // Deshalb müssen wir diesen Trigger selber mit einem Timeout simulieren.
    setTimeout(function(){
        var items = $(alumniAssociationsWrapper+' .country-wrapper');
        var filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).css('display') != 'none') {
                filteredItems.push({ 'element': items[i] });
            }
        }
        updateAlumniGoogleMap(filteredItems);
    }, 1000);
});

/**
 * Andere Karten Anwendungen #22769
 */
var mapApplicationWrapper = '#map-application';
var mapApplicationGrid = '#map-application .teaser-filter';

// Standard-Filter
var mapApplicationFilters = {};

$(document).ready(function() {
    if ($(mapApplicationWrapper).length > 0) {

        $(mapApplicationGrid).isotope({
            itemSelector: '.country-wrapper',
            transitionDuration: '0.8s',
            layoutMode: 'vertical',
            vertical: {
                horizontalAlignment: 0,
            }
        });
    }
});

// Filter Klick
$(mapApplicationWrapper+' .filter a:not(.disabled)').click(function(event) {
    // Schließe alle Accordions
    $(mapApplicationGrid+' .teaser-filter-widget').accordion({
        active: false,
        collapsible: true
    });

    // Aktualisiere Filter
    var selection = $(this).parents('ul');
    var filterGroup = $(selection).data('filter-group');
    mapApplicationFilters[filterGroup] = $(this).data('filter');

    // Aktualisiere Isotope mit Filter
    var filterValue = concatValues(mapApplicationFilters);
    $(mapApplicationGrid).isotope({ filter: filterValue });

    // Markiere aktive Filter
    if (filterGroup == 'region') {
        $(mapApplicationWrapper+' .region-selection .active').removeClass('active');
        $(this).addClass('active');
    } else {
        $(mapApplicationWrapper+' .countryname-selection .active').removeClass('active');
        $(this).addClass('active');
    }

    // #22769
    // Isotope sieht keine Verwendung mit den jQuery UI Accordions vor,
    // deshalb haben wir einen Workaround mittels CSS umgesetzt,
    // wodurch das Event "layoutComplete" aber nicht mehr ausgeführt wird.
    // Deshalb müssen wir diesen Trigger selber mit einem Timeout simulieren.
    setTimeout(function(){
        var items = $(mapApplicationWrapper+' .country-wrapper');
        var filteredItems = [];
        for (var i = 0; i < items.length; i++) {
            if ($(items[i]).css('display') != 'none') {
                filteredItems.push({ 'element': items[i] });
            }
        }
        updateGoogleMap(filteredItems);
    }, 1000);
});
