+function($) {
	'use strict';

	var Timeline = function(elem, options, callback) {
		//this automatically merges the two objects
        this.options = $.extend({}, Timeline.DEFAULT_OPTIONS, options);
        this.elem = elem;
        this.elem.addClass('tl-container');
        if (this.options.title != null && this.options.title != 'null')
            this.insertHead();
        this.insertBody(callback);
	};

    Timeline.DEFAULT_OPTIONS = {
        title : "Community timeline",
        monthsLabels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        apiUrl : 'http://common-fossasia-api.herokuapp.com/ics-collector/CalendarAPI.php',
        source : 'all',
        disableAPISource : false,
        currentYear : '2015',
        limit : '6',
        lazyLoadLimit : '10',
        until : '2016-01-31T23:59:59',
        order : 'latest-first',
        disableScroll : false
    };

    Timeline.prototype.insertHead = function() {
        this.elem.append('<div class="tl-header"><div class="tl-title">' + this.options.title + '</div></div>');
    };

    Timeline.prototype.insertBody = function(callback) {
        var tlBody = $('<div class="tl-body"><div class="tl-events"></div><div class="tl-details" style="display : none;"></div></div>');
        var eventsDiv = tlBody.find('.tl-events');
        var detailsDiv = tlBody.find('.tl-details');
        // Escape html string & convert some special characters to equivalent html tags
        var entityMap = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': '&quot;',
            "'": '&#39;',
            "/": '&#x2F;',
            "\\n" : '<br/>',
            "\\," : ',',
            "\\\"" : '"'
        };

        function escapeHtml(string) {
            return String(string).replace(/[&<>"'\/]|\\n|\\,|\\\"/g, function (s) {
                return entityMap[s];
            });
        }

        var self = this;

        function insertDate(parent, date) {
            var dataDate = new Date(date);
            var eventDate = parent.append('<div class="tl-event-date">').find('.tl-event-date');
            eventDate
                .append('<div class="day">' + dataDate.getDate())
                .append('<div class="month">' + self.options.monthsLabels[dataDate.getMonth()])
            ;
            if (dataDate.getFullYear() != self.options.currentYear) {
                eventDate.append('<div class="year">' + dataDate.getFullYear());
            }
        }

        var eventContainer = null;
        if (this.options.disableScroll) eventContainer = eventsDiv;
        function insertRow(data) {
            var eventDiv = eventContainer.append('<div class="tl-event">').find('.tl-event').last();
            var eventHead = eventDiv.append('<div class="tl-event-head">').find('.tl-event-head');
            eventHead.append('<div class="tl-event-source">' + data.source);
            insertDate(eventHead, data.start);
            eventDiv.append('<div class="tl-event-body">' + (data.description ? escapeHtml(data.description) : (data.summary ? escapeHtml(data.summary) : 'No description provided.')));
					//	eventHead.append('<input type="button" value="new button"/>')
						eventDiv.click(function() {
                updateDetail(data);
                eventsDiv.css('display' , 'none');
                detailsDiv.fadeIn();
            });
            return eventDiv;
        }

        function insertAllRows(data) {
            for (var key in data) {
                var eventDiv = insertRow(data[key]);
                if (key == data.length - 1) {
                    eventDiv.attr('data-date', data[key].start);
                }
            }
            $(document).trigger($.Event('communityTimeline.ready'));
            self.elem.append(tlBody);
        }

        function replaceAt(str, index, character) {
            return str.substr(0, index - 1) + character + str.substr(index - 1 + character.length);
        }

        function prepareElems() {
             // add spinner
            tlBody.append('<i class="spinner animate-spin hidden">&#xe801;</i>');

            // add scrollbar
            if (!self.options.disableScroll) {
                var noMoreEvents = false;
                eventsDiv.mCustomScrollbar({
                    autoHideScrollbar:true,
                    theme: "light-3",
                    callbacks : {
                        onTotalScroll : function() {
                            if (self.options.disableAPISource || noMoreEvents) return;
                            tlBody.find('.spinner').removeClass('hidden');
                            var apiReq = self.options.apiUrl
                                + '?fields=start,source,summary,description,url,end,location,sourceurl'
                                + '&source=' + self.options.source
                                + '&limit=' + self.options.lazyLoadLimit;
                            if (self.options.order === 'latest-first') {
                                apiReq += '&sort=asc-start'
                                + '&to=' + eventsDiv.find('.tl-event').last().data('date');
                            } else {
                                var from = eventsDiv.find('.tl-event').last().data('date');
                                apiReq += '&sort=desc-start'
                                + '&from=' + replaceAt(from, from.length - 1, from[from.length - 1] + 1);
                            }

                            $.getJSON(apiReq, function (apiResult) {
                                    if (apiResult.error) {
                                        console.error('API error : ' + apiResult.error);
                                        if (apiResult.error == "No result found") {
                                            noMoreEvents = true;
                                        }
                                    } else {
                                    for (var key in apiResult) {
                                            apiResult[key].start = self.convertToValidDateTime(apiResult[key].start);
                                            apiResult[key].end = self.convertToValidDateTime(apiResult[key].end);
                                        }
                                    insertAllRows(apiResult);
                                }
                                tlBody.find('.spinner').addClass('hidden');
                            });
                        }
                    },
                    onTotalScrollOffset:100,
                    alwaysTriggerOffsets:false
                });
                eventContainer = eventsDiv.find('.mCSB_container');
            }
        }
        var combinedData = [];
        if (self.options.data) {
            for (var i = 0; i < self.options.data.length; i++) {
                var event = self.options.data[i];
                combinedData.push(event);
            }
        }
        if (!this.options.disableAPISource) {
            this.getData(function(data) {
                 if (data.error) {
                    throw 'API error : ' + data.error;
                }
                prepareElems();
                for (var key in data) {
                    data[key].start = self.convertToValidDateTime(data[key].start);
                    data[key].end = self.convertToValidDateTime(data[key].end);
                    combinedData.push(data[key]);
                }
                insertAllRows(combinedData);
                callback();
            });
        } else {
            prepareElems();
            insertAllRows(combinedData);
        }


        (function prepareDetailsDiv() {
            detailsDiv.append('<a class="communityName" target="_blank">')
                .append('<div class="summary">')
                .append('<div class="description">')
                .append('<div class="datePanel">'
                    + '<div class="start tl-event-date"><div class="day"></div><div class="month"></div><div class="year"></div><div class="time"></div></div>'
                    + '<span>to</span>'
                    + '<div class="end tl-event-date"><div class="day"></div><div class="month"></div><div class="year"></div><div class="time"></div>')
                .append('<div class="location">')
                .append('<a id="eventUrl" class="url" target="_blank">To event page')
                .append('<a href="#" id="goback" class="url">Back to timeline')
								.append('<input type="image" id="button1" src="/pic.png" style="border-style:none;" height="28.5" width="206" align="middle"></input>');
            detailsDiv.find('a#goback').click(function(e) {
                e.preventDefault();
                detailsDiv.css('display', 'none');
                detailsDiv.find('.description').empty();
                detailsDiv.find('.location').empty().attr('title', null);
                eventsDiv.fadeIn();
            });

        })();

        function updateDetail(data) {

            function updateDate(eventDate, date) {
                if (date) {
                    var dataDate = new Date(date);
                    eventDate.show();
                    eventDate.find('.day').text(dataDate.getDate())
                    eventDate.find('.month').text(self.options.monthsLabels[dataDate.getMonth()]);
                    if (dataDate.getFullYear() != self.options.currentYear) {
                        eventDate.find('.year').text(dataDate.getFullYear());
                    }
                    var hours = dataDate.getHours().toString();
                    if (hours.length == 1) hours = '0' + hours;
                    var minutes = dataDate.getMinutes().toString();
                    if (minutes.length == 1) minutes = '0' + minutes;
                    eventDate.find('.time').text(hours + ':' + minutes);
                } else {
                    eventDate.hide();
                }
            }


            detailsDiv.find('a.communityName').attr('href', data.sourceurl ? 'http://' + data.sourceurl : '#').text(data.source);
            detailsDiv.find('.summary').text(data.summary ? data.summary : '');
						detailsDiv.find('input#button1').click(function(e){
							var link;
							var and="&";
							link="?title="+data.source+and+"descp="+data.description+and+"address="+data.location+and+"start="+data.start+and+"end="+data.end;
							 window.open('https://timeline-api-fossasia-redirect.herokuapp.com/page1'+link,'_blank');

						});
            detailsDiv.find('.description')
                .append(escapeHtml(data.description))
                .mCustomScrollbar({
                    theme: "dark",
                });
            if (data.url) detailsDiv.find('a#eventUrl').attr('href', data.url).show();
            else detailsDiv.find('a#eventUrl').hide();
            updateDate(detailsDiv.find('.start'), data.start);
            updateDate(detailsDiv.find('.end'), data.end);
            if (!data.start) detailsDiv.find('.datePanel').find('span').hide();
            else detailsDiv.find('.datePanel').find('span').show();
            if (data.location)
                detailsDiv.find('.location').append(escapeHtml(data.location)).attr('title', data.location).show();

			  }
    };

    // Convert API datetime format to valid javascript format
    // YYYYMMDDT180000(Z) -> YYYY-MM-DDT200000
    Timeline.prototype.convertToValidDateTime= function(datetime) {
        if (!datetime) return '';
        return datetime.substr(0, 4) + '-'
             + datetime.substr(4, 2) + '-'
             + datetime.substr(6, 5) + ':'
             + datetime.substr(11, 2) + ':'
             + datetime.substr(13, 2);
    }

    Timeline.prototype.getData = function(callback) {
        var apiCall = this.options.apiUrl
            + '?fields=start,source,summary,description,url,end,location,sourceurl'
            + '&source=' + this.options.source
            + '&limit=' + this.options.limit;
        if (this.options.order == 'latest-first') {
            apiCall += '&sort=asc-start'
            + '&to=' + this.options.until;
        } else {
            apiCall += '&sort=desc-start'
            + '&from=now';
        }

        $.getJSON(apiCall, function(apiResult) {
            callback(apiResult);
        });
    };

    Timeline.prototype.update = function(first_argument) {
        // body...
    };

	$.fn.communityTimeline = function(options, callback) {
        // avoid warning
        if (!callback) callback = function() {};
        return new Timeline(this, options, callback);
    }
    $.fn.communityTimeline.Constructor = Timeline;
}(jQuery);
