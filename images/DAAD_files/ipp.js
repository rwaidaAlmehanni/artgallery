function daadCreateSlug(str)
{
    str = str.replace(/^\s+|\s+$/g, '');
    str = str.replace(/^\/+|\/+$/g, '');
    str = str.toLowerCase();

    // remove accents, setc
    var from = '/_,:;';
    var to = '-----';
    for (var i = 0, l = from.length; i < l; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace('.', '-');
    str = str.replace(/ä/g, 'ae')
        .replace(/ö/g, 'oe')
        .replace(/ü/g, 'ue')
        .replace(/ß/g, 'ss')
        .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/\-amp\-/g, '-')
        .replace(/^\-+|\-+$/g, '')
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

function daadGetTargetSlugFromElement(e)
{
    var toSlug = '';
    var children = $(e).children();
    if (children.length === 0) {
        return daadCreateSlug($(e).html());
    }
    children.map(function() {
        if (!toSlug) {
            switch (this.tagName) {
                case 'IMG':
                    toSlug = $(this).attr('alt');
                    break;
            }
        }
    });

    return daadCreateSlug(toSlug);
}

function daadGetTrackingElementSlug(e)
{
    var trackingElement = null;
    $(e).closest('.track').map(function() {
        var classes = $(this).attr('class');
        var classNames = classes.split(' ');
        for (var i = 0; i < classNames.length; i++) {
            if (classNames[i].search(/track\-/) != -1) {
                trackingElement = classNames[i].substr(6);
                break;
            }
        }
    });

    return trackingElement;
}

$(document).ready(function() {
    daadEraseCookie('daad_cc_ct_context');
    daadEraseCookie('daad_cc_ct_link');
    daadEraseCookie('daad_cc_ct_referrer');
    daadEraseCookie('daad_cc_ct_reflink');
    daadEraseCookie('daad_cc_ct_linksrc');

    $('a').click(function() {
        if (this.href.indexOf(location.host) > -1) {
            var trackingElement = daadGetTrackingElementSlug(this);

            var dl = /^.+?\.(doc|docx|pdf|rtf|xls|zip)$/g;

            if (dl.test(this.href)) {
                //alert('dl');
            } else {
                daadSetCookie('daad_cc_ct_context', trackingElement, 30);
                daadSetCookie('daad_cc_ct_link', daadGetTargetSlugFromElement(this), 30);
                daadSetCookie('daad_cc_ct_referrer', daad_cc_title, 30);
                daadSetCookie('daad_cc_ct_reflink', daad_cc_title + '.' + daadGetTargetSlugFromElement(this) + '.' + trackingElement, 30);
                daadSetCookie('daad_cc_ct_linksrc', trackingElement + '.' + daadGetTargetSlugFromElement(this), 30);
            }
        }
        return true;
    });
});

function daadSetCookie(key, value, seconds) {
    var expires = '';
    if (seconds) {
        var date = new Date();
        date.setTime(date.getTime() + (seconds * 1000));
        expires = '; expires=' + date.toGMTString();
    }
    if (key) {
        //console.log(document.cookie + '; daad_' + key + '=' + value);
        //document.cookie = document.cookie + '; daad_' + key + '=' + value;
        document.cookie = key + '=' + value + expires + '; path=/';
        //console.log(key);
        //console.log(document.cookie);
    }
}

function daadGetCookie(key) {
    if (key) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var itemKey = cookies[i].substring(0, cookies[i].indexOf('=')).replace(/^\s+|\s+$/g, '');
            if (itemKey == key) {
                var itemValue = cookies[i].substring(cookies[i].indexOf('=') + 1, cookies[i].length).replace(/^\s+|\s+$/g, '');
                return itemValue;
            }
        }
    }
}

function daadEraseCookie(key) {
    daadSetCookie(key, '', -1);
}

$(document).ready(function() {
    var print = $('ul.page-format > li.print a');
    if (print.length > 0) {
        print.click(function() {
            window.print();
            return false;
        });
    }
});

$(document).ready(function() {
    if ($('#hsk-result').length > 0) {
        $('#hsk-result div.course-name').each(function() {
            var wrapper = this.parentNode;
            var tabable = $(wrapper).find('div.tabable');

            $(this).click(function() {
                if (tabable.css('display') == 'block') {
                    tabable.css('display', 'none');
                } else {
                    tabable.css('display', 'block');
                }

                return false;
            });

            var tabmenue = tabable.find('div.course-tabs div');

            tabmenue.each(function() {
                var tab = $(this);
                tab.click(function() {
                    tabable.find('div.course-details div').each(function() {
                        if ($(this).attr('rel') == tab.attr('rel')) {
                            $(this).removeClass('inactive');
                            $(this).addClass('active');
                            tab.removeClass('inactive');
                            tab.addClass('active');
                        } else {
                            $(this).addClass('inactive');
                            $(this).removeClass('active');
                            tabable.find('div.course-tabs div[rel='+$(this).attr('rel')+']').addClass('inactive');
                            tabable.find('div.course-tabs div[rel='+$(this).attr('rel')+']').removeClass('active');
                        }
                    });
                });
            });
        });
    }

    if ($('#hsk-search').length > 0) {
        var form = $('#hsk-search');
        var appendTargetSubject = $('#hsk-search #search_subject').parent();
        var appendTargetCity = $('#hsk-search #search_city').parent();

        $('#hsk-search #search_subject').autocomplete({
			source: "/ajax/hsk/autocomplete/?type=subject&"+form.serialize(),
            minLength: 3,
            appendTo: appendTargetSubject,
            select: function(event, ui) {
                $('#hsk-search #search_subject').val(ui.item.value);
            }
		});

        $('#hsk-search #search_city').autocomplete({
			source: "/ajax/hsk/autocomplete/?type=location&"+form.serialize(),
            minLength: 3,
            appendTo: appendTargetCity,
            select: function(event, ui) {
                $('#hsk-search #search_city').val(ui.item.value);
            }
		});
    }
});

$(document).ready(function() {
    options = {
        checkAllText: 'Alle auswählen',
        uncheckAllText: 'Auswahl aufheben',
        noneSelectedText: 'Bitte wählen Sie',
        selectedText: '# ausgewählt',
        selectedList: 1
    };

    if ($("#gruppe").length > 0) {
        $("#gruppe").multiselect(options);
    }

    if ($("#zland").length > 0) {
        $("#zland").multiselect(options);
    }
});

$(document).ready(function() {
    var che = $('#che');

    if (che.length > 0) {
        var subjectDegrees = che.find('ul.subjects li ul.more');
        if (subjectDegrees.length > 0) {
            subjectDegrees.each(function() {
                var parentNode = this.parentNode;
                var subjects = $(this);
                var link = $(parentNode).find('a[rel=more]');
                if (link.length > 0) {
                    link.click(function() {
                        if (subjects.css('display') == 'none') {
                            subjects.show();
                        } else {
                            subjects.hide();
                        }
                        return false;
                    });
                }
            });
        }

        var infoCriteria = che.find('ul.criteria');
        if (infoCriteria.length > 0) {
            var criteriaOpen = null;
            var criterias = infoCriteria.find('li');
            criterias.each(function() {
                var criteria = $(this);
                var link = criteria.find('a');
                var id = link.attr('rel').replace(/i-/, '');
                var desc = criteria.find('p');
                link.click(function(){
                    var criteriaBox = $(this.parentNode).find('div.indicatorbox');
                    var clickedElement = $(this);
                    criterias.find('p').css('display', 'none');
                    $('div.indicatorbox').css('display', 'none');
                    if (criteriaOpen != link) {
                        if (desc.css('display') == 'none') {
                            if (criteriaBox.html().length == 0) {
                                $.ajax({
                                    'url': basicCheAjaxUrl + 'infocriteria/' + id + '/',
                                    'success': function (data) {
                                        var indicatorBox = clickedElement.parent().find('div.indicatorbox');
                                        //alert(indicatorBox.length);
                                        indicatorBox.html(data);
                                        var indicators = indicatorBox.find('ul.indicators li');
                                        indicators.each(function () {
                                            var indicator = $(this);
                                            var indicatorLink = indicator.find('a');
                                            var indicatorDesc = indicator.find('p');
                                            indicatorLink.click(function () {
                                                indicators.find('p').css('display', 'none');
                                                if (indicatorDesc.css('display') == 'none') {
                                                    indicatorDesc.show();
                                                }
                                                return false;
                                            });
                                        });
                                    }
                                });
                            }
                            desc.show();
                            criteriaBox.css('display', 'block');
                            $('html, body').scrollTop(clickedElement.parent().offset().top);
                        }
                        criteriaOpen = link;
                    } else {
                        criteriaOpen = null;
                        criteriaBox.css('display', 'none');
                    }
                    return false;
                });
            });
        }

        var faqs = che.find('ul.faq');
        if (faqs.length > 0) {
            var faqQuest = faqs.find('li');
            faqQuest.each(function() {
                var quest = $(this);
                var link = quest.find('a').first();
                var desc = quest.find('p');
                link.click(function() {
                    faqQuest.find('p').css('display', 'none');
                    if (desc.css('display') == 'none') {
                        desc.show();
                    }
                    return false;
                });

            });

        }

        var iBrowser = che.find('span.browser');
        if (iBrowser.length > 0) {
            iBrowser.each(function() {
                var button = $(this);
                button.click(function(e) {
                    var rel = $(this).attr('rel').replace(/indikator-/, '');
                    var ids = rel.split('-');

                    var id = ids[0];
                    var subject = 0;

                    if (ids.length > 1) {
                        subject = ids[1];
                    }

                    getIndikatorData(che, id, subject);
                    e.preventDefault();

                });

            });
        }
    }

});



function getIndikatorData(che, id, subject)
{
    $.ajax({
        'url': basicCheAjaxUrl+'indikatorbrowser/'+id+'/'+subject+'/',
        'success': function(data) {
            var wrap = che.find('#indikatorwrap');
            if (wrap.length === 0) {
                che.append('<div id="indikatorwrap"></div>');
                var wrap = che.find('#indikatorwrap');
            }
            wrap.html(data);

            var browserWidth = $('body').outerWidth();
            var resetOffsetL = $('#top').offset().left;
            resetOffsetL = (resetOffsetL*-1);

            var yOffesetWindow = (window.pageYOffset + 60);
            var yOffesetWindowIe = (document.documentElement.scrollTop + 60);

            wrap.css('width', browserWidth+'px');
            wrap.css('left', resetOffsetL+'px');

            $('#indikatorwrap .indikatorbrowser').css('top', yOffesetWindow+'px');
            $('html.ie8 #indikatorwrap .indikatorbrowser').css('top', yOffesetWindowIe+'px');


            wrap.find('select').change(function() {
                getIndikatorData(che, $(this).val(), subject);
            });
        }
    });
}

function closeIndicator(){
    $('#indikatorwrap').remove();
}

function initTablesorter()
{
    if (!$.tablesorter) {
        return;
    }

    sortClicked = false;

    $.tablesorter.addParser({
        id: "starSorting",
        is: function(s) {
            return false;
        },
        format: function(s) {
            s = s.innerHTML;
            if (s.match(/pic_star_bottom/)) {
                s = 1;
            } else if (s.match(/pic_star_middle/)) {
                s = 2;
            } else if (s.match(/pic_star_top/)) {
                s = 3;
            } else {
                s = 0;
            }
            return $.tablesorter.formatFloat(s);

        },
        type: 'numeric'
    });


    $.tablesorter.addParser({
        id: "universitySorter",
        is: function(s) {
            return false;
        },
        format: function(s) {
            s = s.innerHTML;
            s = s.replace(/.*alt="([^"]+).*/, '$1');
            return $.trim(s.toLowerCase());
        },
        type: 'text'
    });

    var sortableTables = $('table.sortable');

    var myTextExtraction = function(node)
    {
        return node;
    };

    if (sortableTables.length > 0) {
        for (var i = 0; i < sortableTables.length; ++i) {

            var th = $(this).find('thead').find('th');
            var sortList = [[0,0], [1,0], [2,0], [3,0], [4,0], [5,0], [6,0], [7,0]];

            var options = {
                headers: {
                    0: { sorter: 'universitySorter' },
                    1: { sorter: 'starSorting' },
                    2: { sorter: 'starSorting' },
                    3: { sorter: 'starSorting' },
                    4: { sorter: 'starSorting' },
                    5: { sorter: 'starSorting' },
                    6: { sorter: 'starSorting' },
                    7: { sorter: 'starSorting' }
                },
                //sortList: sortList,
                textExtraction: myTextExtraction,
                debug: false
            };

            $(sortableTables[i]).tablesorter(options);

            $(sortableTables[i]).bind("sortStart",function() {
                //leer
            }).bind("sortEnd",function() {
                if (sortClicked === true) {
                    var grp = $(this).find('thead').find('th.active')[0].id;
                    var th = $($(this).find('thead').find('th.active')[0]);
                    var iTitle = th.attr('rel');
                    grp = grp.replace(/[^0-9]+/, '');
                    var tbody = $(this).find('tbody');
                    $(tbody).find('td').removeClass('active');
                    var tr = $(tbody).find('tr');

                    for(var i = 0; i < tr.length; i++) {
                        var color = ((i % 2 === 0) ? 1 : 2);
                        tr[i].className = '';
                        tr[i].className = 'color'+color;
                        $($(tr[i]).find('td')[grp]).addClass('active');
                    }
                    sortClicked = false;

                    cheReplaceOrSetComscore('daad_indicators', cheGetSelectedIndicators());
                    var url = daad_comscore_target_url;

                    if (typeof iTitle == 'undefined') {
                        iTitle = 'Name of the University';
                    }

                    url+= '&amp;daad_sortindicator='+iTitle;
                    url+= '&amp;daad_sortdir=';
                    if (th.hasClass('asc')) {
                        url+= 'asc';
                    } else {
                        url+= 'desc';
                    }
                    sitestat(url);
                }
            });

            var th = $(sortableTables[i]).find('th');

            if (th.length > 0) {
                for (var i = 0; i < th.length; ++i) {
                    $(th[i]).css ('cursor', 'pointer');

                    $(th[i]).click(function() {
                        sortClicked = true;

                        if (this.id == 'i0') {
                            if (!$(this).hasClass('active')) {
                                $(this).addClass('asc');
                                $(this).removeClass('desc');
                                $(this).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_red_01.gif';
                                $(this).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_blue_01.gif';
                            } else {
                                if ($(this).hasClass('asc') || !$(this).hasClass('active')) {
                                    $(this).removeClass('asc');
                                    $(this).addClass('desc');
                                    $(this).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_blue_01.gif';
                                    $(this).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_red_01.gif';
                                } else {
                                    $(this).removeClass('desc');
                                    $(this).addClass('asc');
                                    $(this).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_red_01.gif';
                                    $(this).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_blue_01.gif';
                                }
                            }
                        } else {
                            if ($(this).hasClass('asc') || !$(this).hasClass('active')) {
                                $(this).removeClass('asc');
                                $(this).addClass('desc');
                                $(this).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_blue_01.gif';
                                $(this).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_red_01.gif';
                            } else {
                                $(this).removeClass('desc');
                                $(this).addClass('asc');
                                $(this).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_red_01.gif';
                                $(this).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_blue_01.gif';
                            }
                        }

                        if (!$(this).hasClass('active')) {
                            $($(this.parentNode).find('th')).removeClass('active');
                            var th = $(this.parentNode).find('th');

                            for (var i = 0; i < th.length; i++) {
                                if (th[i] != this) {
                                    $(th[i]).find('img')[0].src = '/bundles/daadimperia/pics/che/pic_arrow_top_blue_01.gif';
                                    $(th[i]).find('img')[1].src = '/bundles/daadimperia/pics/che/pic_arrow_bottom_blue_01.gif';
                                }
                            }
                            $(this).addClass('active');
                        }
                    });
                }
            }
        }
    }
}

$(document).ready(function() {
    if ($('#che.myranking').length > 0) {
        var indicators = $('.indicators li');
        indicators.each(function() {
            var li = $(this);
            var id = li.find('span.browser').attr('rel').replace(/[^0-9]+/, '');
            li.css('cursor', 'pointer');
            li.click(function() {
                var selects = $('.indicatorselect select');
                selects.each(function() {
                    var select = $(this);
                    if (select.val() === 0) {
                        var option = select.find('option[rel=indicator-'+id+']');

                        if (option.length > 0) {
                            select.val(option.attr('value'));
                        }
                        return false;
                    }
                });
                return false;
            });
        });
    }
});

$(document).ready(function() {
    var toggleable = $('div.toggleable');
    if (toggleable.length > 0) {
        toggleable.each(function() {
            $(this).find('div.hideable p.toggle').click(function() {
                if ($(this.parentNode).find('div.hidden').length > 0) {
                    var sourceClass = 'hidden';
                    var destClass = 'visible';
                } else {
                    var sourceClass = 'visible';
                    var destClass = 'hidden';
                }

                $(this.parentNode).find('div.'+sourceClass).addClass(destClass).removeClass(sourceClass);
                var rel = $(this).attr('rel');
                var text = $(this).find('a').html();
                $(this).attr('rel', text).find('a').html(rel);

                return false;
            });
        });
    }
});

$(document).ready(function() {
    if ($('#che #ranking-result div.ranking').length > 0) {

        var wrap = $('#che #ranking-result div.ranking');
        wrap.append('<script type="text/javascript" src="'+sorterPath+'"></script>');
        cheInitCompactRankingActions();
        cheInitCompactRankingIndicatorLayer();

        if ($('#che #ranking-result div.profiles').length > 0) {
            $('#che #ranking-result div.profiles select').change(function() {
                cheDisplayIsLoading();
                var profile = $(this).val();
                var iv = cheGetTableIndicators();

                if ($('#che #ranking-result div.ranking').length > 0) {
                    $.ajax({
                        'url': basicCheAjaxUrl+'ranking/result/'+subject+'/'+degree+'/'+hstype+'/?p='+profile+'&iv='+iv.join(','),
                        'success': function(data) {
                            $('#che #ranking-result div.ranking #compact-ranking').html(data.html);
                            cheHideIsLoading();
                            cheInitCompactRankingActions();
                            cheReplaceOrSetComscore('daad_profile', data.profile);
                            sitestat(daad_comscore_target_url);
                        }
                    });
                }
            });
        }

        if ($('#che #ranking-result div.subsubjects').length > 0) {
            $('#che #ranking-result div.subsubjects select').change(function() {
                cheDisplayIsLoading();
                var val = $(this).val();
                var iv = cheGetTableIndicators();

                if ($('#che #ranking-result div.ranking').length > 0) {
                    $.ajax({
                        'url': basicCheAjaxUrl+'ranking/result/'+subject+'/'+degree+'/'+hstype+'/?sub='+val+'&iv='+iv.join(','),
                        'success': function(data) {
                            $('#che h2 a').html(data.subjectHead.label);
                            $('#che h2 a').attr('href', $('#che h2 a').attr('href').replace(/s=[0-9]+/, 's='+data.subjectHead.linkId));
                            $('#che #ranking-result div.ranking #compact-ranking').html(data.html);
                            cheHideIsLoading();
                            cheInitCompactRankingActions();
                            cheReplaceOrSetComscore('daad_subsubject', data.subSubject);
                            cheReplaceOrSetComscore('daad_indicators', cheGetSelectedIndicators());
                            sitestat(daad_comscore_target_url);
                        }
                    });
                }
            });
        }

        if ($('#che #ranking-result div#indicator-selection div.item').length > 0) {
            var numUsed = 0;
            var maxUsable = 6;
            var slotsUsed = {};
            var boxes = $('#che #ranking-result div#indicator-selection div.item');

            boxes.each(function() {
                var number = $(this).find('span.number');

                if ($.trim(number.html()).length > 0)  {
                   numUsed++;
                    slotsUsed[$(this).attr('rel')] = $.trim(number.html()).replace(/[^0-9]+/, '');
                }

                $(this).find('input[type=checkbox]').change(function() {
                    cheDisplayIsLoading();
                    var elem = $(this);

                    if (elem.is(':checked')) {
                        if (numUsed < maxUsable) {
                            var newValue = (numUsed+1);
                            var numberWrapElement = $('#che #ranking-result div#indicator-selection div.item[rel='+elem.attr('id')+'] span.number');
                            slotsUsed[elem.attr('id')] = newValue;
                            numberWrapElement.html(newValue+'.');
                            numUsed = boxes.find('input[type=checkbox]:checked').length;

                            if (numUsed >= maxUsable) {
                                cheIndicatorsChangeBoxesState(true);
                            }
                        } else {
                            $(this).attr('checked', false);
                        }
                    } else {
                        var newSlotsUsed = {};
                        var numberValue = parseInt($.trim(number.html()).replace(/[^0-9]+/, ''));

                        if (numberValue < maxUsable) {
                            $.each(slotsUsed, function(index, value) {
                                var numberWrapElement = $('#che #ranking-result div#indicator-selection div.item[rel='+index+'] span.number');
                                var newValue = (value-1);

                                if (newValue < 1 ) {
                                    newValue = 1;
                                }

                                if (numberValue > parseInt(value)) {
                                    newValue = value;
                                }

                                if (numberValue < parseInt(value) || numberValue > parseInt(value)) {
                                    numberWrapElement.html(newValue+'.');
                                    newSlotsUsed[index] = newValue;
                                } else {
                                    numberWrapElement.html('');
                                }
                            });
                        } else {
                            $.each(slotsUsed, function(index, value) {
                                if (elem.attr('id') != index) {
                                    newSlotsUsed[index] = value;
                                } else {
                                    numberWrapElement = $('#che #ranking-result div#indicator-selection div.item[rel='+elem.attr('id')+'] span.number');
                                    numberWrapElement.html('');
                                }
                            });
                        }

                        slotsUsed = newSlotsUsed;
                        numUsed = boxes.find('input[type=checkbox]:checked').length;

                        if (numUsed < maxUsable) {
                            cheIndicatorsChangeBoxesState(false);
                        }
                    }

                    var sorted = [];

                    $.each(slotsUsed, function(index, value) {
                       sorted[value] = index.replace(/[^0-9]+/, '');
                    });

                    sorted.shift();

                    if ($('#subsubject').length > 0) {
                        var sub = $('#subsubject').val();
                    } else {
                        var sub = '';
                    }

                    $.ajax({
                        'url': basicCheAjaxUrl+'ranking/result/'+subject+'/'+degree+'/'+hstype+'/?sub='+sub+'&iv='+sorted.join(','),
                        'success': function(data) {
                            $('#che #ranking-result div.ranking #compact-ranking').html(data.html);
                            cheHideIsLoading();
                            cheInitCompactRankingActions();
                            cheReplaceOrSetComscore('daad_indicators', cheGetSelectedIndicators());
                            sitestat(daad_comscore_target_url);
                        }
                    });
                });
            });

            if (numUsed >= maxUsable) {
                boxes.find('input[type=checkbox]').attr('disabled', true);
                boxes.find('input[type=checkbox]:checked').attr('disabled', false);
            }
        }

        $('#che #indicator-selection').find('div.restore').click(function() {
            cheDisplayIsLoading();
            var newUrl = [];
            url = window.location.href.split('&');
            for (var i = 0; i < url.length; i++) {
                if (!url[i].match(/^iv=/) && !url[i].match(/^fb=/)) {
                    newUrl.push(url[i]);
                }

            }
            window.location.href = newUrl.join('&');
            return false;
        });
    }
});

function cheIndicatorsChangeBoxesState(state)
{
    var boxes = $('#che #ranking-result div#indicator-selection div.item');

    boxes.find('input[type=checkbox]').attr('disabled', state);
    boxes.find('input[type=checkbox]:checked').attr('disabled', false);
}

function cheGetTableIndicators()
{
    var wrap = $('#che #ranking-result div.ranking');
    var iv = [];

    $.each(wrap.find('th.indicator'), function(index, th) {
        var th = $(th);
        var classes = th.attr('class').split(' ');
        for (var i = 0; i < classes.length; i++) {
            if (classes[i].match(/in-[0-9+]/)) {
                iv.push(classes[i].replace(/[^0-9]+/, ''));
            }
        }
    });

    return iv;
}

function cheInitCompactRankingActions()
{
    initTablesorter();
    cheInitUniversityComparisonChecboxes();
}

function cheInitCompactRankingIndicatorLayer()
{
    if ($('#indicator-selection h3').length > 0) {
        $('#indicator-selection h3').click(function() {
            var wrapper = $(this.parentNode);

            if (wrapper.hasClass('collapsed')) {
                wrapper.removeClass('collapsed');
            } else {
                wrapper.addClass('collapsed');
            }
        });
    }
}

function cheDisplayIsLoading()
{
    $('.comparison-selection').appendTo('div.lastupdate');
    $('.comparison-selection').hide();
    $('.comparison-selection').appendTo('#ranking-result');
    $('#che #ranking-result p.loading').css('display', 'block');
}

function cheHideIsLoading()
{
    $('#che #ranking-result p.loading').css('display', 'none');
}

function cheJumpToLink(params)
{
    if (typeof basicLink != 'undefined') {
        window.location.href = basicLink+params;
    }
}

function cheInitUniversityComparisonChecboxes()
{
    var maxSelection = 3;
    var isSelected = 0;

    var wrap = $('#che #ranking-result div.ranking #compact-ranking');
    var boxes = wrap.find('input[type=checkbox]');

    if (boxes.length > 0) {
        boxes.each(function() {
            var box = $(this);

            if (box.is(':checked')) {
                if (isSelected < maxSelection) {
                    isSelected++;
                }
            }

            box.change(function() {
                if (box.is(':checked')) {
                    if (isSelected < maxSelection) {
                        isSelected++;
                    } else {
                        box.attr('checked', false);
                    }

                    if (isSelected >= maxSelection) {
                        wrap.find('input[type=checkbox]').attr('disabled', true);
                        wrap.find('input[type=checkbox]:checked').attr('disabled', false);
                    }

                    $('.comparison-selection').appendTo(this.parentNode);

                    if (isSelected > 1) {
                        cheToggleCompareButton('show');
                    }
                } else {
                    if (isSelected >= maxSelection) {
                        wrap.find('input[type=checkbox]').attr('disabled', false);
                    }
                    isSelected--;

                    if (isSelected < maxSelection) {
                        wrap.find('input[type=checkbox]').attr('disabled', false);
                        wrap.find('input[type=checkbox]:checked').attr('disabled', false);
                    }

                    if (isSelected < 2) {
                        cheToggleCompareButton('hide');
                    }
                }
            });
        });

        $('#che #ranking-result div.comparison-selection').click(function() {
            var selectedUni = [];
            var linkParams = [];
            linkParams.push('a=matrixranking');
            linkParams.push('s='+subject);
            linkParams.push('hstype='+hstype);
            linkParams.push('d='+degree);

            if ($('#subsubject').length > 0) {
                linkParams.push('sub='+$('#subsubject').val());
            }

            if ($('#profile').length > 0) {
                linkParams.push('p='+$('#profile').val());
            }

            wrap.find('input[type=checkbox]:checked').each(function() {
                selectedUni.push($(this).val());
            });

            linkParams.push('fb='+selectedUni.join(','));
            linkParams.push('iv='+cheGetTableIndicators().join(','));

            var link = basicLink+'?'+linkParams.join('&');

            window.location.href = link;
        });
    }
}

function cheToggleCompareButton(state)
{
    if (state == 'hide') {
        $('#che #ranking-result div.comparison-selection').fadeOut();
    } else {
        $('#che #ranking-result div.comparison-selection').fadeIn();
    }
}

$(document).ready(function() {
    if ($('#che div.quickselect').length > 0) {
        var basicLink = $('#che div.quickselect form').attr('action');

        $('#che div.quickselect select#qs-subject').change(function() {
            var subjectSelection = $(this).val().split('-');

            var url = basicCheAjaxUrl+'quickselect/'+subjectSelection[0]+'/'+subjectSelection[1]+'/';

            $.ajax({
                url: url,
                cache: true,
                dataType: "json"
            }).done(function( data ) {
                $('#che div.quickselect select#qs-degree').html('');

                $('#che div.quickselect select#qs-degree').append(
                    '<option value="">-----</option>'
                );

                var lastValue = '';
                $.each(data, function(index, value) {
                    $('#che div.quickselect select#qs-degree').append(
                        '<option value="'+index+'">'+value.label+'</option>'
                    );
                    lastValue = index;
                });

                if ($('#che div.quickselect select#qs-degree option').length == 2) {
                    $('#che div.quickselect select#qs-degree').val(lastValue);
                    $('#che div.quickselect select#qs-degree').trigger('change');
                }
            });
        });


        $('#che div.quickselect select#qs-degree').change(function() {
            if ($(this).val().length > 0) {
                cheDisplayIsLoading();

                var params = $(this).val().split('-');

                var redirectLink = basicLink;
                redirectLink+= '?a=hitlist';
                redirectLink+='&s='+params[0];
                redirectLink+='&d='+params[2];
                redirectLink+='&hstype='+params[1];
                if (parseInt(params[3]) > 0) {
                    redirectLink+='&sub='+params[3];
                }

                window.location.href = redirectLink;
            }
        });
    }
});

$(document).ready(function() {
    if (typeof daadInitWohnheimfinder != 'undefined') {
        daadInitWohnheimfinder();
    }
 });


function cheReplaceOrSetComscore(name, value)
{
    var parts = daad_comscore_target_url.split('&amp;');
    var newParts = [];
    var notSet = true;
    var pattern = '/'+name+'/';

    for (i = 0; i < parts.length; ++i) {
        var part = parts[i];

        if (part.match(name)) {
            newParts.push(name+'='+value);
            notSet = false;
        } else {
            newParts.push(part);
        }
    }

    if (notSet) {
        newParts.push(name+'='+value);
    }

    daad_comscore_target_url = newParts.join('&amp;');
}

function cheGetSelectedIndicators()
{
    if ($('table#compact-ranking').length > 0) {
        var indicators = [];
        var wrapper = $('table#compact-ranking');
        var thElements = wrapper.find('th');

        thElements.each(function() {
            var indikTitle = $(this).attr('rel');

            if (indikTitle && indikTitle.length > 0) {
                indicators.push(indikTitle);
            }
        });

        return indicators.join(',');
    }

    return '';
}

$(document).ready(function() {
    "use strict";

    var glossaryTerms = $('.glossary-term').tooltip({
        template: '<div class="tooltip glossary-tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        placement: 'top',
        trigger: 'hover',
        delay: 0,
        container: 'body'
    });

    glossaryTerms.on('shown.bs.tooltip', function (e) {
        var currentTooltip = $(this).attr('aria-describedby');
        var tooltipArrow = $('#'+currentTooltip +' .tooltip-arrow');
        var tooltipContentElement = $('#'+currentTooltip +' .tooltip-inner');

        var tooltipContentElementOffset = tooltipContentElement.offset()
        var tooltipContentElementWidth = tooltipContentElement.outerWidth();

        var tooltipContentElementLeftEdge = tooltipContentElementOffset.left;
        var tooltipContentElementRightEdge = tooltipContentElementOffset.left + tooltipContentElementWidth;

        var contentContainer = $('.page-main');
        var contentContainerOffset = contentContainer.offset()
        var contentContainerWidth = contentContainer.outerWidth();

        var contentContainerLeftEdge = contentContainerOffset.left;
        var contentContainerRightEdge = contentContainerOffset.left + contentContainerWidth;

        if (tooltipContentElementLeftEdge <= contentContainerLeftEdge) {
            var neededTooltipoffset = contentContainerLeftEdge;
            $('.glossary-tooltip').css('left', neededTooltipoffset + 'px');
            tooltipArrow.css('left', '0px');
            tooltipArrow.css('margin-left', (((tooltipContentElementWidth / 2) - 5) - (neededTooltipoffset - tooltipContentElementLeftEdge)) + 'px');
        }

        if (tooltipContentElementRightEdge >= contentContainerRightEdge) {
            var neededTooltipoffset = tooltipContentElementRightEdge - contentContainerRightEdge;
            $('.glossary-tooltip').css('margin-left', (neededTooltipoffset * -1) + 'px');
            tooltipArrow.css('margin-left', ((neededTooltipoffset) - 5) + 'px');
        }

        $('.glossary-tooltip').css('visibility', 'visible');
        $('.glossary-tooltip').css('opacity', '1');
    });

    glossaryTerms.on('hide.bs.tooltip', function (e) {
        $('.tooltip-arrow').attr('style', '');
        $('.tooltip-inner').attr('style', '');
        $('.glossary-tooltip').attr('style', '');
        $('.glossary-tooltip').css('visibility', 'hidden');
    });
});


$(document).ready(function() {
    if ($('select#landID').length > 0 && $('select#spracheID').length > 0) {
        $('select#landID').change(function() {
            if (parseInt($(this).val()) > 0) {
                $('#submit-land').attr('disabled', false);
                $('#submit-land').css('opacity', 1);
                $('#submit-land').css('cursor', 'pointer');
            } else {
                $('#submit-land').attr('disabled', 'disabled');
                $('#submit-land').css('opacity', '.5');
                $('#submit-land').css('cursor', 'not-allowed');
            }
        });

        $('select#spracheID').change(function() {
            if (parseInt($(this).val()) > 0) {
                $('#submit-sprache').attr('disabled', false);
                $('#submit-sprache').css('opacity', 1);
                $('#submit-sprache').css('cursor', 'pointer');

            } else {
                $('#submit-sprache').attr('disabled', 'disabled');
                $('#submit-sprache').css('opacity', '.5');
                $('#submit-sprache').css('cursor', 'not-allowed');
            }
        });

        if ($('select#landID').val() == '') {
            $('#submit-land').attr('disabled', 'disabled');
            $('#submit-land').css('opacity', '.5');
            $('#submit-land').css('cursor', 'not-allowed');
        }

        if ($('select#spracheID').val() == '') {
            $('#submit-sprache').attr('disabled', 'disabled');
            $('#submit-sprache').css('opacity', '.5');
            $('#submit-sprache').css('cursor', 'not-allowed');
        }
    }
});
