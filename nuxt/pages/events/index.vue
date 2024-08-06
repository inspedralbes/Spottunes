<template>
  <div v-if="loader"
    class="h-full w-full fixed inset-y-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <Loader />
  </div>
  <Header />
  <USlideover v-model="modals.filter" side="left" class="scroll-auto">
    <UTabs v-model="selectedFilter" :items="[{ label: ' Filtres' }, { label: 'Mapa' }]" class="m-2"></UTabs>
    <UCard v-if="selectedFilter === 0" class="flex flex-col flex-1"
      :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Filtres
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.filter = !modals.filter" />
        </div>
      </template>
      <div>
        <UDivider label="Països" class="my-4" />
        <USelectMenu searchable searchable-placeholder="Cerca el teu país..." option-attribute="country" color="gray"
          v-model="countrySelected" :options="locations" multiple placeholder="Selecciona els països">
        </USelectMenu>
        <div class="mt-2 flex flex-wrap">
          <UButton v-for="country in countrySelected" color="gray" :label="country.country" variant="outline"
            icon="i-heroicons-x-mark-20-solid" class="m-1 ml-0" @click="deleteCountry(country)" />
        </div>
      </div>
      <div v-if="countrySelected.length > 0">
        <UDivider label="Ciutats" class="my-4" />
        <USelectMenu v-for="country in countrySelected" searchable searchable-placeholder="Busca la teva ciutat..."
          option-attribute="city" color="gray" v-model="citySelected" :options="country.cities" multiple
          placeholder="Selecciona les ciutats" />
        <div class="mt-2 flex flex-wrap">
          <UButton v-for="city in citySelected" color="gray" :label="city.city" variant="outline"
            icon="i-heroicons-x-mark-20-solid" class="m-1 ml-0" @click="deleteCity(city)" />
        </div>
      </div>
      <div v-if="citySelected.length > 0">
        <UDivider label="Espais" class="my-4" />
        <USelectMenu searchable searchable-placeholder="Cerca el teu espai..." color="gray" v-model="venueSelected"
          :options="getVenues" multiple placeholder="Selecciona els espais" />
        <div class="mt-2 flex flex-wrap">
          <UButton v-for="venue in venueSelected" color="gray" :label="venue" variant="outline"
            icon="i-heroicons-x-mark-20-solid" class="m-1 ml-0" @click="deleteVenue(venue)" />
        </div>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <!-- <UButton @click="resetFilter" color="red" variant="ghost" label="Restaurar filtres"></UButton> -->
          <UButton @click="filterEvents" label="Guardar filtres"></UButton>
        </div>
      </template>
    </UCard>
    <UCard v-if="selectedFilter === 1" class="flex flex-col flex-1"
      :ui="{ body: { base: 'flex-1' }, ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
            Mapa
          </h3>
          <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1"
            @click="modals.filter = !modals.filter" />
        </div>
      </template>
      <UDivider :label="`Distancia (${distance}km)`" class="mb-4" />
      <URange color="orange" min="1" max="1500" v-model="distance"></URange>
      <UInput type="number" color="orange" size="md" icon="i-heroicons-globe-alt" v-model="distance" min="1" max="1500"
        class="mt-2">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-md">Km</span>
        </template>
      </UInput>
      <UDivider :label="`Mapa`" class="my-4" />
      <Map class="h-3/4 w-full rounded-lg overflow-hidden" @location-selected="newLocation = $event" />
      <template #footer>
        <div class="flex justify-end">
          <!-- <UButton @click="resetFilters" color="red" variant="ghost" label="Restaurar filtres"></UButton> -->
          <UButton @click="filterEvents" label="Guardar filtres"></UButton>
        </div>
      </template>
    </UCard>
  </USlideover>

  <div v-if="loader"
    class="h-full w-full fixed inset-y-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
    <Loader />
  </div>

  <main class="w-[90vw] min-h-screen mx-auto py-4 flex flex-col gap-6 relative bg-[#212121]">
    <h1 class="text-center uppercase text-2xl font-bold text-balance text-white">Els propers esdeveniments més top</h1>
    <div class="flex flex-row w-full justify-between">
      <div class=" border-white border-b-2 w-[80%] flex flex-row justify-between">
        <input type="text" class="bg-[#212121] p-2 w-full outline-none" placeholder="Cerca un esdeveniment..."
          v-model="searchFilter" @keyup.enter="busqueda" />
        <button v-if="searchFilter" @click="clearBusqueda">
          <IconsCross class="size-8" />
        </button>
      </div>
      <button @click="modals.filter = !modals.filter"
        class="bg-white hover:bg-[#FF8A1E] text-black font-bold py-2 px-4 rounded-full w-fit">
        Filtres
      </button>
    </div>
    <section class=" flex flex-col gap-3 mb-12">
      <div v-for="evento in eventosFiltrados" :key="evento.id">
        <CardEvent :event="evento" />
      </div>
    </section>
  </main>
  <Menu />
</template>

<script>
import { useStores } from '@/stores/counter.js'
import comManager from '@/managers/comManager.js';
import eventManager from '@/managers/eventManager.js';

export default {
  data() {
    return {
      store: useStores(),
      // eventos: computed(() => this.store.events),
      eventosFiltrados: computed(() => this.store.events),
      eventosLike: [],
      locations: computed(() => this.store.locations),
      countrySelected: [],
      citySelected: [],
      venueSelected: [],
      modals: {
        filter: false,
        map: false,
      },
      distance: 50,
      userLocation: computed(() => this.store.userLocation),
      newLocation: {},
      selectedFilter: 1,
      loader: false,
      searchFilter: '',
    };
  },
  methods: {
    deleteCountry(country) {
      this.countrySelected = this.countrySelected.filter(c => c.country !== country.country)
      this.citySelected = this.citySelected.filter(city => !country.cities.includes(city));
      this.venueSelected = this.venueSelected.filter(venue => {
        this.citySelected.find(c => c.cities.includes(venue));
      });
    },
    deleteCity(city) {
      this.citySelected = this.citySelected.filter(c => c.city !== city.city)
      this.venueSelected = this.venueSelected.filter(venue => !city.venues.includes(venue));
    },
    deleteVenue(venue) {
      this.venueSelected = this.venueSelected.filter(v => v !== venue)
    },
    busqueda() {
      if (this.searchFilter === '' || this.searchFilter.length === 0) return
      this.loader = true;
      eventManager.getEventsByName(this.searchFilter).then(() => {
        this.loader = false;
      })
    },
    clearBusqueda() {
      this.loader = true;
      this.searchFilter = ''
      eventManager.getEventsByDistance(this.userLocation.latitude, this.userLocation.longitude, 50).then(() => {
        this.loader = false;
      })
    },
    filterEvents() {
      let data = {
        countries: null,
        cities: null,
        venues: null,
        latitude: null,
        longitude: null,
        distance: null
      }
      if (this.selectedFilter === 0) {
        data = {
          countries: this.countrySelected.map(c => c.country),
          cities: this.citySelected.map(c => c.city),
          venues: this.venueSelected,
        }
        this.loader = true;
        eventManager.getFilteredEvents(data)
          .then((response) => {
            this.modals.filter = false
            this.loader = false;
          })
      } else {
        data = {
          latitude: this.newLocation.latitude || this.userLocation.latitude,
          longitude: this.newLocation.longitude || this.userLocation.longitude,
          distance: this.distance
        }
        this.loader = true;
        eventManager.getEventsByDistance(data.latitude, data.longitude, data.distance)
          .then((response) => {
            this.modals.filter = false;
            this.loader = false;
          })
      }
    },
    resetFilters() {
      this.countrySelected = []
      this.citySelected = []
      this.venueSelected = []
      this.eventosFiltrados = []
      this.distance = 50;
      this.newLocation = {}
      eventManager.getEventsByDistance(this.userLocation.latitude, this.userLocation.longitude, this.distance)
    },
    fetchGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.location = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            comManager.convertGeolocation(this.location.latitude, this.location.longitude)
              .then(response => {
                const data = response.data.address;
                this.location.city = data.city;
                this.location.country = data.country;
                this.location.province = data.province;
              })
          },
          error => {
            console.error("Error getting geolocation: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },


  },
  created() {
  },
  async mounted() {
    if (!this.userLocation) {
      this.loader = true;
      await comManager.getEvents().then(() => {
        this.loader = false;
      });
    } else {
      this.loader = true;
      await eventManager.getEventsByDistance(this.userLocation.latitude, this.userLocation.longitude, 50).then(() => {
        this.loader = false;
      });
    }
  },
  computed: {
    getVenues() {
      let venues = []
      this.citySelected.forEach(city => {
        city.venues.forEach(venue => {
          venues.push(venue.venue)
        });
      });
      return venues
    }
  },
  watch: {
    citySelected() {
      if (this.citySelected.length === 0) {
        this.venueSelected = []
      }
    },
    distance(newValue) {
      this.store.distance = newValue;
    },
  }
};
</script>