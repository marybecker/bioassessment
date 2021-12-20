mapboxgl.accessToken = 'pk.eyJ1IjoibWFyeS1iZWNrZXIiLCJhIjoiY2p3bTg0bDlqMDFkeTQzcDkxdjQ2Zm8yMSJ9._7mX0iT7OpPFGddTDO5XzQ';

// const map = new mapboxgl.Map({
//     container: 'map', // container element id
//     style: 'mapbox://styles/mapbox/dark-v10',
//     center: [-72.65, 41.55], // initial map center in [lon, lat]
//     zoom: 8.5
// });

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: {
        'version': 8,
        'sources': {
            'raster-tiles': {
                'type': 'raster',
                'tiles': [
                    'https://basemap.nationalmap.gov/arcgis/rest/services/USGSHydroCached/MapServer/tile/{z}/{y}/{x}'
                ],
                'tileSize': 256,
                'attribution':
                    'USGS The National Map: National Hydrography Dataset. Data refreshed October 2021.'
            }
        },
        'layers': [
            {
                'id': 'simple-tiles',
                'type': 'raster',
                'source': 'raster-tiles',
                'minzoom': 0,
                'maxzoom': 17
            }
        ]
    },
    center: [-72.65, 41.55], // starting position
    zoom: 8.5 // starting zoom
});

// when the map is done loading
map.on('load', () => {

    // request our GEOJSON data
    d3.json('./data/BugBCG.geojson').then((data) => {
        // when loaded

        const bugData = d3.json('./data/BugBCG.geojson');
        const stateBoundaryData = d3.json('./data/ctStateBoundary.geojson');

        Promise.all([bugData,stateBoundaryData]).then(addLayer);

    });
});


function addLayer(data){

    console.log(data);
    const bugs = data[0];
    const boundary = data[1];

    // first add the source to the map
    map.addSource('bcg-data', {
        type: 'geojson',
        data: bugs // use our data as the data source
    });

    map.addSource('lines',{
        'type': 'geojson',
        'data': boundary
    });

    map.addLayer({
        id: 'bcg',
        type: 'circle',
        source: 'bcg-data',
        paint: {
            // Make circles larger as the user zooms from z12 to z22.
            'circle-radius': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'YCNT']],
                0,
                5,
                10,
                20
            ],
            // Color circles BCG, using a `match` expression.
            'circle-color': [
                'interpolate',
                ['linear'],
                ['number', ['get', 'BCG']],
                2,
                '#008080',
                3,
                '#70a494',
                4,
                '#f6edbd',
                5,
                '#de8a5a',
                6,
                '#ca562c'
            ],
            'circle-opacity': 0.7
        },
        filter: ['==', ['get', 'SYEAR'], '1989']
    });

    map.addLayer({
        'id': 'lines',
        'type': 'line',
        'source': 'lines',
        'paint': {
            'line-width': 3,
        // Use a get expression (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-get)
        // to set the line-color to a feature property value.
            'line-color': '#333333'
        }
    });

    addPopup('bcg')
    addInteraction('bcg')


}

function addInteraction(layer){

    document.getElementById('slider').addEventListener('input', (event) => {
        const year = event.target.value;
        console.log(year);
        // update the map
        map.setFilter(layer, ['==', ['get', 'SYEAR'], year]);


        // update text in the UI
        document.getElementById('active-year').innerText = year;
    });
}



function addPopup(layer){

    // Create a popup, but don't add it to the map yet.
    const popup = new mapboxgl.Popup({
        className: 'sitePopup',
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', layer, function(e) {

        const popupInfo =   "<b>" + e.features[0].properties.NAME +" ("+
                            e.features[0].properties.STA_SEQ+ ")</b> </br> BCG " +
                            e.features[0].properties.BCG.toFixed(1) +
                            bcgStressLevel(e.features[0].properties.BCG)+ "</br> Sample Date: " +
                            e.features[0].properties.SDATE + "</br> Count of Sample Years: " +
                            e.features[0].properties.YCNT + "</br> Year Range: " +
                            e.features[0].properties.MINYEAR + " - " + e.features[0].properties.MAXYEAR;

        // When a hover event occurs on a feature,
        // open a popup at the location of the hover, with description
        // HTML from the click event's properties.
        popup.setLngLat(e.lngLat).setHTML(popupInfo).addTo(map);
    });

    // Change the cursor to a pointer when the mouse is over.
    map.on('mousemove', layer, () => {
        map.getCanvas().style.cursor = 'pointer';
    });

    // Change the cursor back to a pointer when it leaves the point.
    map.on('mouseleave', layer, () => {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}

function bcgStressLevel (bcgTier){
    if(bcgTier <3){
        return " - Low Stress";
    }
    else if(bcgTier >= 3 && bcgTier < 5){
        return " - Moderate Stress";
    }
    else if(bcgTier >= 5){
        return " - High Stress"
    }
    else{
        return "NA"
    }
}
