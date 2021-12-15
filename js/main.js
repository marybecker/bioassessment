mapboxgl.accessToken = 'pk.eyJ1IjoibWFyeS1iZWNrZXIiLCJhIjoiY2p3bTg0bDlqMDFkeTQzcDkxdjQ2Zm8yMSJ9._7mX0iT7OpPFGddTDO5XzQ';

const map = new mapboxgl.Map({
    container: 'map', // container element id
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-72.65, 41.55], // initial map center in [lon, lat]
    zoom: 8.5
});

// when the map is done loading
map.on('load', () => {

    // request our GEOJSON data
    d3.json('./data/BugBCG.geojson').then((geojson) => {
        // when loaded
        console.log(geojson);
        addLayer(geojson);
        // addLegend(geojson);
    });
});


function addLayer(geojson){
    // first add the source to the map
    map.addSource('bcg-data', {
        type: 'geojson',
        data: geojson // use our data as the data source
    });

    map.addLayer({
        id: 'bcg',
        type: 'circle',
        source: 'bcg-data',
        paint: {
            // Make circles larger as the user zooms from z12 to z22.
            'circle-radius': {
                'base': 2,
                'stops': [
                    [12, 8],
                    [18, 50],
                    [22, 150]
                ]
            },
            // Color circles BCG, using a `match` expression.
            'circle-color': [
                'match',
                ['get', 'BCG'],
                '2',
                '#2DC4B2',
                '3',
                '#3BB3C3',
                '4',
                '#669EC4',
                '5',
                '#A2719B',
                '6',
                '#AA5E79',
                /* other */ '#ccc'
            ]
        },
        filter: ['==', ['get', 'SYEAR'], '1989']
    });
}

document.getElementById('slider').addEventListener('input', (event) => {
    const year = event.target.value;
    console.log(year);
    // update the map
    map.setFilter('bcg', ['==', ['get', 'SYEAR'], year]);


    // update text in the UI
    document.getElementById('active-year').innerText = year;
});
