		var map = L.map('map').setView([40.722864, -73.901081], 12);

		L.tileLayer('http://{s}.tile.stamen.com/toner-lite/{z}/{x}/{y}.png', {
			maxZoom: 18,

		}).addTo(map);


		// control that shows state info on hover

		var info = L.control();

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h3>Accidents </b>reported by precint</h3>' 
			+ '<h4>Hover the map</h4>' + (props ? '<h2><b></h2>' + props.pedestrians2_Crashes + '</b><br />'

				+ props.pedestrians2_Borough + props.pedestrians2_Date +' <h2></h2> '
				: '<h3></h3>');
		};

		info.addTo(map);


		// get color depending on population density value

		function getColor(d) {
			return d > 50 ? '#bd0026' :
			       d > 30  ? '#bd0026' :
			       d > 15  ? '#fd8d3c' :
			       d > 5  ? '#feb24c' :
			       d > 0   ? '#fed976' :
			                  '#ffffb2';
		}

		function style(feature) {
			return {
				weight: 2,
				opacity: 1,
				color: 'white',
				dashArray: '3',
				fillOpacity: 0.7,
				fillColor: getColor(feature.properties.pedestrians2_Crashes)
			};
		}

		function highlightFeature(e) {
			var layer = e.target;

			layer.setStyle({
				weight: 5,
				color: '#666',
				dashArray: '',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				layer.bringToFront();
			}

			info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
			geojson.resetStyle(e.target);
			info.update();
		}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		geojson = L.geoJson(statesData, {
			style: style,
			onEachFeature: onEachFeature
		}).addTo(map);

		map.attributionControl.addAttribution('tutorials example');


		var legend = L.control({position: 'bottomright'});

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0, 5, 15, 30],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);