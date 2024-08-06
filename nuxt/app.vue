<template>
  <NuxtPage />
  <UNotifications style="position: top-0; bottom: auto;" />

</template>

<script>
import userManager from '@/managers/userManager.js';
import eventManager from './managers/eventManager.js';
import comChat from './managers/chatManager.js';
import { socket } from '../socket';
import { useStores } from '@/stores/counter';

export default {
  data() {
    return {
      userLocation: {},
      store: useStores(),
    }
  },
  created() {
  },
  mounted() {
    this.fetchGeolocation();
    eventManager.getLocations();
    this.connectSocket();
    socket.on("notification", async () => {
      if (this.$route.path !== '/chats') {
        const toast = useToast();
        toast.add({ title: 'Has rebut un nou missatge' });
      }
    });
  },
  methods: {
    fetchGeolocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.userLocation = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            userManager.convertGeolocation(this.userLocation.latitude, this.userLocation.longitude);
          },
          error => {
            console.error("Error getting geolocation: ", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    },
    connectSocket() {
      if (this.store.getLoggedIn()) {
        socket.emit('logged', this.store.getId());
        this.getChats();
      }
    },
    async getChats() {
      const chats = await comChat.getChats(this.store.getId());
      if (chats.length != 0) {
        for (const chat of chats) {
          const messages = await comChat.getMessagesNotReceived(chat._id, this.store.getId());
          if (messages.count > 0) {
            const toast = useToast();
            toast.add({ title: `Tens missatges nous des de l'última connexió` });
            break;
          }
        }
        for (const chat of chats) {
          const messages = await comChat.getMessagesNotReceived(chat._id, this.store.getId());
          if (messages.count > 0) {
            console.log(await comChat.markMessagesAsReceived(chat._id, this.store.getId()));
          }
        }
      }
    }
  },
  watch: {
    userLocation: {
      handler: function (val) {
        eventManager.getEventsByDistance(this.userLocation.latitude, this.userLocation.longitude, 50)
      },
      deep: true,
    },
  },
}
</script>

<style>
body {
  background-color: #212121;
  color: white;
}
</style>