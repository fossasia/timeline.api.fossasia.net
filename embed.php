<html>
<head>
	<link rel="stylesheet" type="text/css" href="malihu-scrollbar/jquery.mCustomScrollbar.min.css" />
	<link rel="stylesheet" type="text/css" href="timeline.css"/>
	<link rel="stylesheet" type="text/css" href="embed.css"/>
</head>
<body>
	<div id="embed-timeline"></div>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
	<script src="malihu-scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
	<script src="timeline.js"></script>
	<script>
	$(document).ready(function() {
		var options = {};
		<?php
			$customOptions = array('source', 'from', 'until', 'order', 'limit', 'title', 'disableScroll');
			foreach ($customOptions as $option) {
				if (array_key_exists($option, $_GET)) {
					echo "options['$option'] = '$_GET[$option]';";
				}
			}
		?>

		$('#embed-timeline').communityTimeline(options, function() {
			window.parent.postMessage('embed-timeline-loaded', "*");
		});
		window.onerror = function(err) {
			if (err.indexOf('API error') != -1) {
				window.parent.postMessage('embed-timeline-error', "*");
			}
		};
	});
	</script>
</body>