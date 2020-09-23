

 
mapboxgl.accessToken = 'pk.eyJ1Ijoic2lkcmFtZXNoIiwiYSI6ImNrZXM5b200ZzEzMGcyd3Q4NTF2MGhoaXgifQ.E00ksrn6a-ytq1_Hx4LClg';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
    center: [-74.5, 40], // starting position [lng, lat]
    zoom: 1 // starting zoom
});

 // TO  add a custom theme selector on top of the map
var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');
 
function switchLayer(layer) {
var layerId = layer.target.id;
map.setStyle('mapbox://styles/mapbox/' + layerId);
}

//this part of the code for the geocoder api
map.addControl(
    new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
    })
    );
// This code adds Map navigation controls to the map
map.addControl(new mapboxgl.NavigationControl());


 



 // This part of the code adds the markers on the locations from the corona virus data base
for (var i = 0; i < inputs.length; i++) {
inputs[i].onclick = switchLayer;
}
    fetch("https://api.covid19api.com/summary")
        .then(response => response.json())
        .then(rsp => {
            // console.log(rsp.data)
            rsp.Countries.forEach(element => {
                countryName = element.Country
                let latitude = null
                let longitude = null
                fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${countryName}.json?types=country&access_token=pk.eyJ1Ijoic2lkcmFtZXNoIiwiYSI6ImNrZXM5b200ZzEzMGcyd3Q4NTF2MGhoaXgifQ.E00ksrn6a-ytq1_Hx4LClg`)
                .then(response => response.json())
                .then(resp => {
                   longitude = resp.features[0].geometry.coordinates[0];
                   latitude = resp.features[0].geometry.coordinates[1];
                })
                cases = element.TotalConfirmed;
                if (cases>255){
                    color = "rgb(255, 0, 0)";
                }

                else{
                    color = `rgb(${cases}, 0, 0)`;
                }

                let textToset = `${countryName},   
                  INFECTED = ${element.TotalConfirmed}, 
                TOTAL DEATHS = ${element.TotalDeaths}`
                var popup = new mapboxgl.Popup({ offset: 10 }).setText(textToset);
                // Mark on the map
                function drawMarker(){
                    new mapboxgl.Marker({
                        draggable: false,
                        color: color
                    }).setLngLat([longitude, latitude])
                    .setPopup(popup)
                    .addTo(map); 
                }

                setTimeout(drawMarker, 5000)
            });
        })
 