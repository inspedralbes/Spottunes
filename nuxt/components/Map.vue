<template>
    <div>
        <LMap ref="map" :zoom="zoom" :max-zoom="18"
            :center="[newLocation.latitude || userLocation.latitude, newLocation.longitude || userLocation.longitude]"
            @ready="mapInitialized" @click="handleMapClick">
            <LTileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&amp;copy; <a href=&quot;https://www.openstreetmap.org/&quot;>OpenStreetMap</a> contributors"
                layer-type="base" name="OpenStreetMap" />
            <LMarker
                :lat-lng="[newLocation.latitude || userLocation.latitude, newLocation.longitude || userLocation.longitude]"
                :icon="getMarkerIcon(0)">
            </LMarker>
            <LMarker v-for="(venue, index) in venues" :key="index" :lat-lng="[venue.latitude, venue.longitude]"
                :icon="getMarkerIcon(1)">
                <LPopup :content="getPopupContent(venue)">
                </LPopup>
            </LMarker>
            <l-circle
                :lat-lng="[newLocation.latitude || userLocation.latitude, newLocation.longitude || userLocation.longitude]"
                :radius="(distance * 1000)" color="#3388ff" />
        </LMap>
    </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useStores } from '@/stores/counter.js';

export default {
    data() {
        return {
            store: useStores(),
            zoom: 8,
            map: ref(null),
            userLocation: computed(() => this.store.userLocation),
            newLocation: {},
            locations: computed(() => this.store.locations),
            venues: [],
            distance: computed(() => this.store.distance),
            circleRadius: 0,
            circle: null,
            greenIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            orangeIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
            blueIcon: new L.Icon({
                iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            }),
        };
    },
    created() {
        this.newLocation = this.store.newLocation;
    },
    mounted() {
        this.venues = this.getVenues();
        this.newLocation = this.store.newLocation;
    },
    methods: {
        mapInitialized() {

        },
        handleMapClick(event) {
            const latlng = event.latlng;
            this.newLocation = {
                latitude: latlng.lat,
                longitude: latlng.lng
            }

            this.store.newLocation = this.newLocation;

            this.$emit('location-selected', this.newLocation)
        },
        getVenues() {
            const venueMap = {};

            this.locations.forEach(location => {
                location.cities.forEach(city => {
                    city.venues.forEach(venue => {
                        const key = `${venue.latitude},${venue.longitude}`;
                        if (!venueMap[key]) {
                            venueMap[key] = [];
                        }
                        venueMap[key].push(venue.venue);
                    });
                });
            });

            const venues = [];
            for (const key in venueMap) {
                if (venueMap.hasOwnProperty(key)) {
                    const [latitude, longitude] = key.split(',');
                    venues.push({
                        latitude: parseFloat(latitude),
                        longitude: parseFloat(longitude),
                        names: venueMap[key]
                    });
                }
            }
            return venues;
        },
        getMarkerIcon(num) {
            switch (num) {
                case 0:
                    return this.orangeIcon;
                case 1:
                    return this.blueIcon;
            }
        },
        getPopupContent(venue) {
            return venue.names.join('<br>');
        }
    },
    watch: {

    }
}
</script>
