
var daadFormData = {}
daadFormData.page = 1;
daadFormData.epp = 5;

function daadInitStipDb()
{
    if ($('#ifa-stipendien-detail').length > 0) {
        daadInitTabs();
        daadInitApplicationButton();
        daadInitStipDbTooltip();
        daadInitYourSelection();
        daadInitTargetCountrySelection();
    } else {
        daadInitTabs();
        daadInitApplicationButton();
        daadInitCleanupSearchVars(false);
        daadInitSelectboxes();
        daadInitStipDbForm();
        daadInitStipDbFormActions();
        daadGetResultlist();
        daadInitStipDbTooltip();
    }
}

function daadShowHidePrintButton(action) {

    if(action == 'hide') {
        $('.page-format').hide();
    }

    if(action == 'show') {
        $('.page-format').show();
    }
}

function daadInitCleanupSearchVars(doClear)
{
    if (!window.location.href.match(/back\=1/) || doClear) {
        jsParamstatus = '';
        if (!window.location.href.match(/\/laenderinformationen\//)) {
            jsParamorigin = '';
        }
        jsParamsubjectGrps = '';
        jsParamdaad = '';
        jsParamq = '';
    }
}

function daadInitStipDbFormActions()
{
    $('#stipdb-submit').click(function() {
        daadFormData.isTrackable = true;
        daadFormData.page = 1;
        daadInitCleanupSearchVars(true);
        $('div.stipdb-filters form').trigger('submit');
        return false;
    });
    $('div.stipdb-filters form').submit(function() {
        daadFormData.isTrackable = true;
        daadGetResultlist();
        return false;
    });
}

function daadInitSelectboxes()
{
    var statusRecords = persStatus();
    statusRecords.each(function(r) {
        var select = $('#s-status');
        select.append(
            '<option value="'+ r.id+'">'+eval('r.name'+langField)+'</option>'
        );
    });
    if (jsParamstatus.length > 0) {
        $('#s-status').val(parseInt(jsParamstatus));
    }

    var sortname = 'name'+langField;
    if (lang == 'de') {
        sortname = 'sortname';
    }
    var originRecords = origin().order(sortname);
    originRecords.each(function(r) {
        var select = $('#s-land');
        select.append(
            '<option value="'+ r.id+'">'+eval('r.name'+langField)+'</option>'
        );
    });
    if (jsParamorigin.length > 0) {
        $('#s-land').val(parseInt(jsParamorigin));
    }

    var subjectGroups = subjectGrps();
    subjectGroups.each(function(r) {
        var select = $('#s-fach');
        select.append(
            '<option value="'+ r.code+'">'+eval('r.name'+langField)+'</option>'
        );
    });
    if (jsParamsubjectGrps.length > 0) {
        $('#s-fach').val(jsParamsubjectGrps);
    }

    daadFormData.page = parseInt(jsParampage, 10);
    if (isNaN(daadFormData.page)) {
        daadFormData.page = 1;
    }
}

function daadGetResultlist()
{
    if (jsParamdaad.length > 0) {
        $('#c-daadonly').attr('checked', 'checked');
    }

    if (jsParamq.length > 0) {
        $('#i-stichwort').val(jsParamq);
    }

    var filter = {};
    var statusValue = $('#s-status').val();
    if (parseInt(statusValue) > 0) {
        filter.status = {"has": parseInt(statusValue)}
    }
    var countryValue = $('#s-land').val();
    if (parseInt(countryValue) > 0) {
        filter.origin = {"has": parseInt(countryValue)}
    }
    var subjectValue = $('#s-fach').val();
    if (subjectValue.length > 0) {
        filter.subjectGrps = {"has": subjectValue}
    }
    var daadOnly = $('#c-daadonly');
    if (daadOnly.attr('checked') == 'checked') {
        filter.isDaad = {"is": 1}
    }
    var keywordValue = $('#i-stichwort').val();
    if (keywordValue.length > 0) {
        eval('filter.q'+langField+' = {"like": keywordValue.toLowerCase()}');
    }

    var records = scholarships().filter(filter).order('programmname'+langField);
    daadDisplayPagination(records.count(), daadFormData.epp);
    daadUpdatePaginationListeners();

    $('span.numScholarships').html(records.count());

    if (records.count() == 1) {
        if (lang == 'de') {
            $('span.scholarshipName').html('Fördermöglichkeit');
        } else if (lang == 'en') {
            $('span.scholarshipName').html('Scholarship option');
        } else {
            $('span.scholarshipName').html('Posibilidad de promoción');
        }

    }

    var start = ((daadFormData.page-1)*daadFormData.epp);

    if (daadFormData.page > 1) {
        start+=1;
    }

    if (daadFormData.page > 1 && !daadFormData.isTrackable) {
        daadFormData.isTrackable = true;
    }

    if (window.location.href.match(/back\=1/) && !daadFormData.isTrackable) {
        daadFormData.isTrackable = true;
    }

    if (typeof daadFormData.isTrackable == 'undefined') {
        daadFormData.isTrackable = true;
    }

    if (daadFormData.isTrackable != false) {
        url = daad_comscore_target_url;
        url = url.replace(/\.suche/g, '.liste');
        url = url.replace(/_suche/g, '_liste');
        url+= '&ns_search_result='+$('span.numScholarships').html();
        url+= '&daad_page='+daadFormData.page;
        url+= '&search_engine=stipendiendatenbank-auslaender';

        var sitestatTermParams = new Array();

        if (keywordValue.length > 0) {
            url+= '&daad_freitext='+escape(keywordValue);
            sitestatTermParams.push('Freitext:'+keywordValue);
        }

        if (typeof filter.status != 'undefined') {
            if (parseInt(filter.status.has) > 0) {
                var pStatus = persStatus({id:filter.status.has.toString()});
                if (pStatus) {
                    url+= '&daad_status='+$.trim(escape(pStatus.first().nameDe));
                    sitestatTermParams.push('Status:'+pStatus.first().nameDe);
                }
            }
        }

        if (typeof filter.origin != 'undefined') {
            if (parseInt(filter.origin.has) > 0) {
                var pOrigin = origin({id:filter.origin.has.toString()});
                if (pOrigin) {
                    url+= '&daad_origin='+$.trim(escape(pOrigin.first().nameDe));
                    sitestatTermParams.push('Herkunftsland:'+pOrigin.first().nameDe);
                }
            }
        }

        if (typeof filter.subjectGrps != 'undefined') {
            if (filter.subjectGrps.has.length > 0) {
                var pSubjectGrps = subjectGrps({code:filter.subjectGrps.has.toString()});
                if (pSubjectGrps) {
                    url+= '&daad_subjectGrp='+$.trim(escape(pSubjectGrps.first().nameDe));
                    sitestatTermParams.push('Fachgebiet:'+pSubjectGrps.first().nameDe);
                }
            }
        }

        if (typeof filter.isDaad != 'undefined') {
            if (filter.isDaad.is == 1) {
                url+= '&daad_nurdaad=1';
                sitestatTermParams.push('NurDaad:Ja');
            }
        }

        if (sitestatTermParams.length > 0) {
            url+='&ns_search_term='+escape(sitestatTermParams.join('_'));
        }

        daadFormData.isTrackable = false;
        sitestat(url);
    }

    var records = scholarships().filter(filter).order('isDaad desc, programmname'+langField+' ').limit(daadFormData.epp).start(start);
    var list = $('div.stipdb-results ul.resultlist');

    list.find('li').remove();

    records.each(function(r) {
        list.append(daadRenderResultRow(r, filter));
    });

    daadInitStipDbTooltip();

    linkParams = createLinkParams(filter, langField, daadFormData.page);
    linkParams.push('back=1');
    pushSearchParamsToUrlForBackLink(linkParams);
}

function pushSearchParamsToUrlForBackLink(linkParams)
{
    var uri = window.location.href.split('/?');
    var newUri = uri[0] + '/?' + linkParams.join('&');
    newUri = newUri.replace('//?', '/?');
    history.pushState('', '', newUri);
}

function createLinkParams(filter, langField, page)
{
    var linkParams = [];
    if (typeof filter.status != 'undefined') {
        linkParams.push('status='+filter.status.has);
    } else {
        linkParams.push('status=');
    }
    if (typeof filter.origin != 'undefined') {
        linkParams.push('origin='+filter.origin.has);
    } else {
        linkParams.push('origin=');
    }
    if (typeof filter.subjectGrps != 'undefined') {
        linkParams.push('subjectGrps='+filter.subjectGrps.has);
    } else {
        linkParams.push('subjectGrps=');
    }

    if (typeof filter.isDaad != 'undefined') {
        linkParams.push('daad='+filter.isDaad.is);
    } else {
        linkParams.push('daad=');
    }

    if (typeof eval('filter.q'+langField) != 'undefined') {
        linkParams.push('q='+eval('filter.q'+langField+'.like'));
    } else {
        linkParams.push('q=');
    }

    linkParams.push('page='+page);

    return linkParams;
}

function daadRenderResultRow(r, filter)
{
    var statusLabel = '---';
    if (r.status.length > 0) {
        statusLabel = ''
        for(var i = 0; i < r.status.length; ++i) {
            var s = r.status[i];

            if (s > 0) {
                var sRecord = persStatus({id: s.toString()});
                if (sRecord.count() > 0) {
                    sRecord = sRecord.first();
                    if (statusLabel.length > 0) {
                        statusLabel+= ', ';
                    }
                    statusLabel+= eval('sRecord.name'+langField);
                }
            }
        }
    }

    if (r.subjectGrps.length > 0) {
        var sgList = $('<ul></ul>');
        for(var i = 0; i < r.subjectGrps.length; ++i) {
            var g = r.subjectGrps[i];
            if (typeof g == 'string') {
                var sRecord = subjectGrps({code: g});
                if (sRecord.count() > 0) {
                    sRecord = sRecord.first();
                    sgList.append('<li>'+eval('sRecord.name'+langField)+'</li>')
                }
            }
        }
    }

    if (r.isDaad == 1) {
        var isDaad = $('<span/>');
        isDaad.html('<span>&nbsp;• DAAD</span>');
    } else {
        var isDaad = $('<span>&nbsp;</span>');
    }

    linkParams = createLinkParams(filter, langField, daadFormData.page);
    linkParams.push('lang='+lang);
    linkParams.push('sd=1');
    linkParams.push('detail='+ r.sapProgid);
    linkParams.push('page='+daadFormData.page)
    var link = basicLink+'?'+linkParams.join('&amp;');

    var wrap = $('<li class="entry clearfix"></li>');
    wrap.append('<h2>'+
        '<a href="'+link+'">'+ eval('r.programmname'+langField) +isDaad.html()+'</a>'+
        '</h2>'+
        '<div class="row clearfix">'+
        '<div class="col">'+
        '<dl>'+
        '<dt>'+translations['status'][lang]+':</dt>'+
        '<dd>'+statusLabel+'&nbsp;</dd>'+
        '<dt>'+translations['herkunftsland'][lang]+':</dt>'+
        '<dd>'+translations['nurbestimmte'][lang]+' '+
        '<i class="info-icon"></i>'+
        '<div class="tool-tip-stipdb tool-tip-land">'+
        '<p>'+translations['tooltippherkunftsland'][lang]+'</p>'+
        '</div>'+
        '</dd>'+
        '<dt>'+translations['fachrichtung'][lang]+':</dt>'+
        '<dd>'+translations['nurbestimmte'][lang]+' '+
        '<i class="info-icon"></i>'+
        '<div class="tool-tip-stipdb">'+
        '<p>'+translations['tooltippfachrichtung'][lang]+':</p><ul>'+sgList.html()+'</ul>'+
        '</div>'+
        '</dd>'+
        '</dl>'+
        '</div>'+
        '<div class="col">'+
        '<p class="entry-detail">'+ eval('r.introduction.'+lang) + '...</p>'+
        '</div>'+
        '</div>'+
        '<div class="entry-arrow">'+
        '<a href="'+link+'">'+ eval('r.programmname'+langField) +isDaad.html()+'</a>'+
        '</div>'+
        '</li>'
    );

    return wrap;
}

function daadSubmitSearch()
{
    $('div.stipdb-filters form').submit();
}

function daadDisplayPagination(numElements, epp)
{
    $('ul.pagination').children().remove();

    var numPages = Math.ceil(numElements / epp);
    if (numPages <= 1) {
        return;
    }

    var output = '';

    output += '<li><a';
    if (daadFormData.page == 1) {
        output += ' class="disabled"';
    }
    output += ' href="#">«</a></li>';

    var printDots = false;
    for (var i=1; i<=numPages; i++) {
        if (numPages > 15 && i>4 && i<numPages-4) {
            if (!printDots) {
                output += '<li><a class="disabled" href="#">...</a></li>';
                printDots = true;
            }
            if (i == daadFormData.page) {
                output += '<li><a class="current" href="#">' + i + '</a></li>'
                + '<li><a class="disabled" href="#">...</a></li>';
            }
            continue;
        }
        output += '<li><a';
        if (i == daadFormData.page) {
            output += ' class="current"';
        }
        output += ' href="#">' + i + '</a></li>';
    }

    output += '<li><a';
    if (daadFormData.page == numPages) {
        output += ' class="disabled"';
    }
    output += ' href="#">»</a></li>';
    $('ul.pagination').html(output);
}

function daadUpdatePaginationListeners()
{
    $('ul.pagination li a').click(function() {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        var numClicked = $(this).html();
        if (numClicked == '«') {
            daadFormData.page = daadFormData.page - 1;
        } else if (numClicked == '»') {
            daadFormData.page = daadFormData.page + 1;
        } else {
            daadFormData.page = Math.round(numClicked);
        }
        daadSearchAfterNavigationHappened = true;
        daadSubmitSearch(true);

        $('html, body').animate({scrollTop:0}, 'fast');

        return false;
    });
}

function daadInitTabs()
{
    daadShowHidePrintButton('hide');

    $('#programTab a').click(function (e) {
        e.preventDefault();
        $(this).tab('show');
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        daadToggleStipdbTabEvent(e);
    });

    $('a[data-toggle="tab"]').on('shown', function (e) {
        daadToggleStipdbTabEvent(e);
    });

    var urlTabMatch = window.location.href.toString();

    if(urlTabMatch.indexOf('#') >= 0) {
        urlTabMatch = urlTabMatch.replace(/.*\#/, "");
    } else {
        urlTabMatch = '';
    }

    if (urlTabMatch.length > 0) {
        changeTab(urlTabMatch);
    }

    $('#herkunft').popover();
    $('#fachrichtung').popover();
}

function daadToggleStipdbTabEvent(e)
{
    if (e.target.toString().match(/voraussetzungen/)) {
        $('#weitere-voraussetzungen').hide();
    } else {
        $('#weitere-voraussetzungen').show();
    }

    if ($('#select-application-info').length == 0) {

        if (e.target.toString().match(/ueberblick/)) {
            daadShowHidePrintButton('hide');
            console.log('Überblick');
        } else {
            daadShowHidePrintButton('show');
        }

        return
    }

    if (e.target.toString().match(/hinweise/)) {
        $('#select-application-info').show();
        $('#ifa-stipendien-detail .page-container').hide();
        $('#cd-ref').val(e.target.toString().replace(/.*\#/, ""));
        daadInitSelectLayerCaptions($('#cd-ref').val());
        daadInitStipDbForm();
    } else if (e.target.toString().match(/voraussetzung/)) {
        $('#select-application-info').show();
        $('#ifa-stipendien-detail .page-container').hide();
        $('#cd-ref').val(e.target.toString().replace(/.*\#/, ""));
        daadInitSelectLayerCaptions($('#cd-ref').val());
        daadInitStipDbForm();
    } else if (e.target.toString().match(/prozess/)) {
        $('#select-application-info').show();
        $('#ifa-stipendien-detail .page-container').hide();
        $('#cd-ref').val(e.target.toString().replace(/.*\#/, ""));
        daadInitSelectLayerCaptions($('#cd-ref').val());
        daadInitStipDbForm();
    } else if (e.target.toString().match(/bewerbung/)) {
        $('#select-application-info').show();
        $('#ifa-stipendien-detail .page-container').hide();
        $('#cd-ref').val(e.target.toString().replace(/.*\#/, ""));
        daadInitSelectLayerCaptions($('#cd-ref').val());
        daadInitStipDbForm();
    } else if (e.target.toString().match(/kontaktberatung/)) {
        $('#select-application-info').show();
        $('#ifa-stipendien-detail .page-container').hide();
        $('#cd-ref').val(e.target.toString().replace(/.*\#/, ""));
        daadInitSelectLayerCaptions($('#cd-ref').val());
        daadInitStipDbForm();
    } else {
        $('#ifa-stipendien-detail .page-container').show();
        $('#select-application-info').hide();
    }
}

function daadInitSelectLayerCaptions(identifier)
{
    if (typeof layerCaptions[identifier] != 'undefined') {
        $('#select-application-info h3 span').html(layerCaptions[identifier]['headline']);
        $('#select-application-info #stipdb-submit-detail').val(layerCaptions[identifier]['button']);
    }
}

function extractCountryId()
{
    var params = window.location.href.split('&');
    var countryId = 0;

    for (i=0; i < params.length; ++i) {
        if (params[i].match(/land=/)) {
            countryId = params[i].replace(/[^0-9]+/, '');
        }
    }

    return parseInt(countryId);
}

function changeTab(id)
{
    $('html, body').animate({scrollTop:0}, 'fast');
    $("#programTab a."+id).tab('show');

    if (id == 'voraussetzungen') {
        $('#weitere-voraussetzungen').hide();
    } else {
        $('#weitere-voraussetzungen').show();
    }
}

function daadToggleAccordeon(id)
{
    changeTab(id);
}

function daadInitApplicationButton()
{
    var form = $('#bewerbung').find('form');
    var pcopies = '000';

    if (form.length > 0) {
        if (jsParamorigin.length > 0 && jsParamdetail.length > 0) {
            var filter = {};
            filter.sapProgid = {"is": parseInt(jsParamdetail)}
            filter.countryId = {"is": parseInt(jsParamorigin)}

            if (typeof papercopies != 'undefined') {
                var records = papercopies().filter(filter);

                if (records.count() > 0) {
                    pcopies = records.first().num;
                }
            }
        }

        form.find('button').each(function() {
            $(this).attr('rel', $(this).attr('rel')+'-'+pcopies);
        });

        form.find('button').click(function() {
            var params = $(this).attr('rel').split('-');
            var link = 'https://portal.daad.de/sap/bc/bsp/sap/z_set_cookie/setcookie.htm?fund_ar=stv&langb=';
            link+= params[2]+'&id='+params[1]+'&persk='+params[3]+'&lziel='+params[4]+'&pcopies='+pcopies;
            var newwindow = window.open(link);

            return false;
        });
    }
}

function daadInitStipDbTooltip() {
    var tooltipOpen = false;

    $('html').click(function(){

        if (tooltipOpen == true){
            $('.tool-tip-stipdb').hide();
            $('.popover').hide();
            tooltipOpen = false;
        }

    });

    $('.info-icon').click(function(event){

        event.stopPropagation();
        $('.tool-tip-stipdb').hide();
        $(this).parent().find('.tool-tip-stipdb').show();
        tooltipOpen = true;

    });

}

function daadInitStipDbForm() {

    var config = {
        '.stipdb-filters .chzn-select-deselect'  : {
            allow_single_deselect:true,
            disable_search_threshold: 10000
        },
        '.chzn-select' : {
            disable_search_threshold: 10000
        },
        '#select-application-info-form .chzn-select-deselect'  : {
            allow_single_deselect:true,
            disable_search_threshold: 10000
        }
    }
    for (var selector in config) {
        $(selector).chosen(config[selector]);
    }
}

function daadInitYourSelection()
{
    var wrap = $('div.your-choice span.selection');
    var selection = '';

    if (jsParamstatusName.length > 0 || jsParamsubjectGrpsName.length > 0) {
        if (lang == 'de') {
            selection = '• Ihre Auswahl: Förderprogramme';
        } else if (lang == 'en') {
            selection = '• Your selection: Scholarship programmes';
        } else {
            selection = '• Su elección: Programas de apoyo';
        }
    }

    if (jsParamstatusName.length > 0) {
        if (lang == 'de') {
            selection+= '&nbsp;für <strong>'+jsParamstatusName+'</strong>';
        } else if (lang == 'en') {
            selection+= '&nbsp;for <strong>'+jsParamstatusName+'</strong>';
        } else {
            selection+= '&nbsp;para <strong>'+jsParamstatusName+'</strong>';
        }
    }

    if (jsParamsubjectGrpsName.length > 0) {
        if (lang == 'de') {
            selection+= '&nbsp;in der <strong>Fachrichtung '+jsParamsubjectGrpsName+'</strong>';
        } else if (lang == 'en') {
            selection+= '&nbsp;with the <strong>discipline '+jsParamsubjectGrpsName+'</strong>';
        } else {
            selection+= '&nbsp;con la <strong>especialidad '+jsParamsubjectGrpsName+'</strong>';
        }
    }

    if (jsParamoriginName.length > 0) {
        if (lang == 'de') {
            selection+= '&nbsp;mit dem <strong>Herkunftsland '+jsParamoriginName+'</strong>';
        } else if (lang == 'en') {
            selection+= '&nbsp;with the <strong>country of origin '+jsParamoriginName+'</strong>';
        } else {
            selection+= '&nbsp;con el <strong>país de procedencia '+jsParamoriginName+'</strong>';
        }
    }

    wrap.html(selection);
}

function daadInitTargetCountrySelection ()
{
    if ($('.target-country-selection').length > 0) {
        var selectionBox = $('.target-country-selection').find('select');

        if (location.href.match(/stb/)) {
            $('html, body').animate({
                scrollTop: $(".target-country-selection").offset().top
            }, 1);
        }

        selectionBox.change(function() {
            if (parseInt($(this).val()) > 0) {
                $('.info-form').find('ul.instances').html('<li>'+translations['loading'][lang]+'</li>');

                var linkParams = new Array();
                linkParams.push('status=' + jsParamstatus);
                linkParams.push('origin=' + jsParamorigin);
                linkParams.push('subjectGrps=' + jsParamsubjectGrps);
                linkParams.push('daad=' + jsParamdaad);
                linkParams.push('q=' + jsParamq);
                linkParams.push('page=' + jsParampage);
                linkParams.push('detail=' + jsParamdetail);
                linkParams.push('target=' + $(this).val());
                linkParams.push('stb=1');

                var link = basicLink + '?' + linkParams.join('&')+'#bewerbung';

                window.location.href = link;
            } else {
                $('.info-form').find('ul.instances').html('');
            }
        });
    }

}

var translations = new Array();
translations['status'] = new Array();
translations['status']['de'] = 'Status';
translations['status']['en'] = 'Status';
translations['status']['es'] = 'estatus';
translations['herkunftsland'] = new Array();
translations['herkunftsland']['de'] = 'Herkunftsland';
translations['herkunftsland']['en'] = 'Country of Origin';
translations['herkunftsland']['es'] = 'país de procedencia';
translations['fachrichtung'] = new Array();
translations['fachrichtung']['de'] = 'Fachrichtung';
translations['fachrichtung']['en'] = 'Subject';
translations['fachrichtung']['es'] = 'materia';
translations['nurbestimmte'] = new Array();
translations['nurbestimmte']['de'] = 'nur bestimmte';
translations['nurbestimmte']['en'] = 'Only specified';
translations['nurbestimmte']['es'] = 'solo algunos(as)';
translations['tooltippherkunftsland'] = new Array();
translations['tooltippherkunftsland']['de'] = 'Die Förderung durch dieses Programm ist auf bestimmte Herkunftsländer beschränkt. Erläuterungen dazu finden Sie auf der Detailseite des Förderprogramms unter den Bewerbungsvoraussetzungen.';
translations['tooltippherkunftsland']['en'] = 'The scholarship for this programme is restricted to certain countries of origin. You can find an explanation for this on the details page of the scholarship programme under the application requirements.';
translations['tooltippherkunftsland']['es'] = 'La promoción a través de este programa está limitada a determinados países de origen. Encontrará las aclaraciones correspondientes en la página de datos del programa de apoyo, en los requisitos para la solicitud.';
translations['tooltippfachrichtung'] = new Array();
translations['tooltippfachrichtung']['de'] = 'Beschränkt auf folgende Fachrichtungen';
translations['tooltippfachrichtung']['en'] = 'Restricted to the following disciplines';
translations['tooltippfachrichtung']['es'] = 'Limitado a las siguientes especialidades';
translations['loading'] = new Array();
translations['loading']['de'] = 'Wird geladen...';
translations['loading']['en'] = 'Loading...';

