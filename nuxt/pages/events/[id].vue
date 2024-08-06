<template>
  <main class="min-h-screen relative">
    <header class='w-[80%] flex justify-between absolute top-4 left-1/2 -translate-x-1/2 z-10'>
      <NuxtLink to='/events'>
        <IconsLeftArrow class="size-6 bg-black rounded-full bg-opacity-60" />
      </NuxtLink>

      <button @click="toggleLike" :class="{
        'px-4 py-1 text-black font-semibold rounded-full text-sm transition duration-300': true,
        'bg-red-400 hover:bg-red-600 text-white': event.like,
        'bg-white hover:bg-green-500 hover:text-white': !event.like
      }">
        {{ event.like ? 'Siguiendo' : 'Seguir' }}
      </button>
    </header>
    <div class='h-[218px] relative'>
      <img v-if="eventImage" :src="eventImage" class='w-full h-full object-cover' :alt="`Foto de ${event.event}`" />
      <div class='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-50% from-transparent to-[#212121]'></div>
    </div>

    <article class='w-[80%] mx-auto flex flex-col gap-3 mt-6'>
      <p v-if="event.genre && event.genre !== 'Undefined'" class="text-xs text-[#A4A4A4]">{{ event.genre }}</p>
      <h1 class='text-2xl font-bold'>{{ event.event }}</h1>
      <div class='flex justify-between items-center'>
        <div class='space-y-1'>
          <h2 class='font-semibold text-sm flex gap-1 items-center'>
            <IconsMapPin class="size-5" /> {{ event.city }}
          </h2>
          <h2 class='font-semibold text-sm flex gap-1 items-center'>
            <IconsMusic class="size-5" /> {{ event.venue }}
          </h2>
        </div>
        <div class='space-y-1'>
          <h2 class='font-semibold text-sm flex gap-1 items-center'>
            <IconsCalendar class="size-5" /> {{ event.date }}
          </h2>
          <h2 class='font-semibold text-sm flex gap-1 items-center'>
            <IconsClock class="size-5" /> {{ event.time }}
          </h2>
        </div>
      </div>
      <h3 class='text[#CACACA] text-sm'>{{ counterFollowers }} persones inscrites</h3>
      <div class='w-full h-[2px] bg-[#888888]'></div>
      <div v-if="mostrarSeg" v-for="follower in followers" :key="follower.id">
        <UserCardEvent :follower="follower" />
      </div>
      <div v-if="loadingFollowers" class="flex justify-center items-center">
        <div class="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600"></div>
      </div>
      <div v-if="noFollowersComputed" class="flex justify-center items-center">
        No hi ha cap seguidor en aquest esdeveniment
      </div>
      <button type="button" v-if="loadMoreFollowers" @click="getFollowers()"
        class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Veure
        mes seguidors...</button>
    </article>
  </main>
</template>

<script>
import { useStores } from '@/stores/counter.js';
import comManager from '@/managers/comManager.js';

export default {
  data() {
    return {
      store: useStores(),
      eventID: parseInt(this.$route.params.id),
      event: {},
      eventImage: '',
      counterFollowers: 0,
      page: 0,
      followers: [],
      loadingFollowers: false,
      loadMoreFollowers: false,
      mostrarSeg: false
    }
  },
  created() {
    this.getEventById();
  },
  mounted() {
    if (!this.store.getLoggedIn()) return this.$router.push('/join');
    this.getEventCounterFollowers();
    this.getFollowers();
  },
  methods: {
    getEventById() {
      this.event = this.store.events.find(event => event.id === this.eventID);
    },
    async toggleLike() {
      let response;
      if (!this.event.like) {
        response = await comManager.likeAnEvent(this.event.id)
        if (response.status === 200) {
          this.event.like = true
          this.counterFollowers += 1;
          this.followers.push(this.store.getUserInfo());
          this.store.events[this.findIndex(this.event.id)].like = true;
        }
      } else {
        response = await comManager.unlikeAnEvent(this.event.id)
        if (response.status === 200) {
          this.event.like = false
          this.counterFollowers -= 1;
          this.followers = this.followers.filter(follower => follower.id !== this.store.getUserInfo().id);
          this.store.events[this.findIndex(this.event.id)].like = false;
        }
      }
    },
    findIndex(eventId) {
      return this.store.getEvents().findIndex(event => event.id === eventId);
    },
    async getEventCounterFollowers() {
      const response = await comManager.getEventCounterFollowers(this.event.id);
      this.counterFollowers = response.data.eventFollowers;
    },
    async getFollowers() {
      this.loadingFollowers = true;
      this.mostrarSeg = false;

      const response = await comManager.getEventFollowers(this.event.id, this.page);
      const followersMongo = response.data;


      if (followersMongo.length === 0) {
        this.loadingFollowers = false;
        this.loadMoreFollowers = false;
      } else {
        var confirmLoadMore = false;
        if (followersMongo.length === 10) {
          this.page++;
          confirmLoadMore = true;
        } else {
          this.loadMoreFollowers = false;
        }

        for (const follower of followersMongo) {
          const userResponse = await comManager.getUserById(follower.userId, this.store.getToken());
          this.followers.push(userResponse.data);
        }
        this.loadingFollowers = false;
        if (confirmLoadMore) {
          this.loadMoreFollowers = true;
        } else {
          this.loadMoreFollowers = false;
        }
      }
      this.mostrarSeg = true;
    }
  },
  computed: {
    noFollowersComputed() {
      if (this.followers.length === 0 && !this.loadingFollowers) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    event() {
      const imagesJSON = JSON.parse(this.event.images);
      this.eventImage = imagesJSON[2];
    }
  }
}
</script>
