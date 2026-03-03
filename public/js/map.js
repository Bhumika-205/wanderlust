const coords = [
    listing.geometry.coordinates[1], // lat
    listing.geometry.coordinates[0]  // lng
];

const key = mapApi;
const map = L.map('map').setView(coords, 14); //starting position
L.tileLayer(`https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,{ //style URL
    tileSize: 512,
    zoomOffset: -1,
    minZoom: 1,
    crossOrigin: true
}).addTo(map);

// create marker at center
// const marker = L.marker(coords).addTo(map);

const airbnbMarker = L.divIcon({
    className: "",
    html: `
        <div class="airbnb-marker">
            <i class="fa-solid fa-compass"></i>
        </div>
    `,
    iconSize: [40, 50],
    iconAnchor: [20, 50]
});

const marker = L.marker(coords, { icon: airbnbMarker }).addTo(map);

// ---------- POPUP ----------
const popupHTML = `
<div class="popup-card">
    <img src="${listing.image.url}" alt="listing">
    <h3>${listing.title}</h3>
    <p>${listing.location}</p>
    <span>₹ ${listing.price}</span>
</div>
`;

marker.bindPopup(popupHTML,{
    closeButton:false,
    offset:[0,-30]
}).openPopup();