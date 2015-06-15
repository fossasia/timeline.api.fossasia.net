# Community Timeline

A flexible jQuery plugin to embed FOSSASIA community timeline into your website.


### Initialize

```html
<div id="timeline-id"></div>
<script src="timeline.js"></script>
<script>
$('#timeline-id').communityTimeline({});
</script>
```

### Library options

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

### Examples

  http://etud.insa-toulouse.fr/~hadang/EventsPanel/Timeline/timeline.html
