Community Timeline
===========
A flexible jQuery plugin to embed FOSSASIA community timeline to your website.

[![Join the chat at https://gitter.im/fossasia/api.fossasia.net](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/fossasia/api.fossasia.net?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## How to use

* Clone the repo 

```
git clone https://github.com/fossasia/timeline.api.fossasia.net lib
```

* Include css & js files in html page, prepare a blank div, and call library initializer

```html
<head>
  <link rel="stylesheet" type="text/css" href="lib/malihu-scrollbar/jquery.mCustomScrollbar.min.css" />
  <link rel="stylesheet" type="text/css" href="lib/timeline.css"/>
</head>
<div id="timeline-id"></div>

<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="lib/malihu-scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
<script src="lib/timeline.js"></script>
<script>
  var options = {title: "Awesome timeline plugin", limit : 5};
  $('#timeline-id').communityTimeline(options);
</script>
```

## Library options

* **title**

  Title of the timeline.

* **source** :

  The community source to get events from. Support multiple communities selection, separating by commas (for e.g : `"source" : "community1,community2"`). Default to `"all"`.

* **apiUrl**

  Link to a deploy instance of FOSSASIA/Freifunk Calendar API.

* **data**
 
  An array of events data in valid API format. This option provides an alternative way to populate event feeds in the timeline, alongside with events coming from Calendar API.

* **disableAPISource**

  Sometimes the user wants to use this plugin just to display custom data. In that case, set `disableAPISource` to `true` to allow uniquely custom events.

* **order** 

  The order of displayed events. Possible values are : `latest-first` and 'oldest-first'. In `latest-first` mode, option `until` should be configured to limit the upper bound of events date. In `oldest-first` mode, the lower bound is set to the current datetime as the default.

* **until** 

  Limit to API events happening before `until` date. `until` option value is a valid javascript datetime string, for e.g. : `'2016-01-31T23:59:59'`. Only used in `latest-first` order mode.

* **limit**

   Limit of number of events initially loaded.

* **lazyLoadLimit**

   Limit of number of events that will be added when user scrolls to bottom of timeline.

* **monthsLabels**

  An array of 12 labels corresponding to 12 months for displaying event date. Default to abbreviations of English months : `['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']`.

* **currentYear**

  By default this value is set to current year in 4-digits. The year of events happening in currentYear will not be displayed in datetime area.

* **disableScroll**
 
  Disable malihu scrollbar for events list.
  
## Examples

  http://fossasia.github.io/timeline.api.fossasia.net/

## Contribute

  The styling can be furtherly improved, either by modifying `timeline.css`, or by overriding with custom style. Either way, please help us improve the library, report issues or send us pull requests.
  
[FOSSASIA API repo](https://github.com/fossasia/api.fossasia.net)
