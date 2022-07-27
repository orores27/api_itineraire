/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
function initMap() {
  const directionsService = new google.maps.DirectionsService();
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 7,
    center: { lat: 41.85, lng: -87.65 },
  });

  directionsRenderer.setMap(map);

  const onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  
  const btn = document.querySelector('button');
  btn.addEventListener("click", onChangeHandler);



  // document.getElementById("start").addEventListener("change", onChangeHandler);
  // document.getElementById("end").addEventListener("change", onChangeHandler);
}

let etapes = [];
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  let transport = document.querySelector("select").value;
  let transportOptions = google.maps.TravelMode.DRIVING;
  if (transport == "velo") {
    transportOptions = google.maps.TravelMode.BICYCLING;
  } else if (transport == "pied"){
    transportOptions = google.maps.TravelMode.WALKING;
  }
console.log(transport);
  directionsService
    .route({
      origin: {
        query: document.getElementById("start").value,
      },
      destination: {
        query: document.getElementById("end").value,
      },
      unitSystem: google.maps.UnitSystem.METRIC,
      drivingOptions: {
        departureTime: new Date(),
        trafficModel: 'optimistic'
      },
      travelMode: transportOptions,
    })
    .then((response) => {
      let results = response;
      console.log(response);

      // Affichage de la page avec les infos

      const depart = document.querySelector('#depart');
      depart.textContent = results.routes[0].legs[0].start_address;

      const arrivee = document.querySelector('#arrivee');
      arrivee.textContent = results.routes[0].legs[0].end_address;

      const distance = document.getElementById('distance');
      distance.textContent = results.routes[0].legs[0].distance.text;

      const duree = document.getElementById('duree');
      duree.textContent = results.routes[0].legs[0].duration.text;

      // Affichage des données sur le tableau

      // const template = document.querySelector('#template');
      // tbody = cible dans laquelle on place le template
      const tbody = document.querySelector('tbody');

      etapes = results.routes[0].legs[0].steps;
      let numero=1;
      tbody.textContent = "";
      etapes.forEach(etape => {
       
        let tr=document.createElement("tr");
        let th=document.createElement("th");
        th.textContent=numero;
        let td1=document.createElement("td");
        td1.textContent = etape.distance.text;
        let td2=document.createElement("td");
        td2.textContent = etape.duration.text;
        let td3=document.createElement("td");
        td3.innerHTML = etape.instructions;
        /*const clone = document.importNode(template.content, true);*/
        tr.appendChild(th);
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        
        tbody.appendChild(tr);
        numero++;
      });

      if (etapes != []) {
        document.querySelector('#map').style.display = "block";
        document.querySelector('#displayResults').style.display = "block";
      }

      directionsRenderer.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));
}

window.initMap = initMap;


