<template>

    <div class='relative w-full h-56 rounded-xl overflow-hidden'>
        <NuxtLink :to="store.getLoggedIn() ? `/events/${event.id}` : '/join'">
            <img class='w-full h-full brightness-[.4] object-cover' :src="JSON.parse(event.images)[2]" alt="" />
            <div class='absolute bottom-2 left-2'>
                <h2 class='text-white text-xl font-semibold text-left'>{{ event.event }}</h2>
                <p class='text-white flex items-center gap-1'>
                    <IconsMapPin class="size-4" />{{ event.city }}
                </p>
                <p class='text-white flex items-center gap-1'>
                    <IconsCalendar class="size-4" />{{ event.date }}
                </p>
                <p class='text-white flex items-center gap-1'>
                    <IconsUsers class="size-4" />{{ followers }} inscrits
                </p>
            </div>
        </NuxtLink>

        <button v-if="event.like" class="absolute bottom-2 right-2 p-1 rounded-lg bg-red-500 hover:bg-red-700"
            @click="toggleLike">
            <IconsHeartFill size="20" />
        </button>

        <button v-else class="absolute bottom-2 right-2 p-1 rounded-lg bg-green-500 hover:bg-green-700"
            @click="toggleLike">
            <IconsHeart size="20" />
        </button>

    </div>

</template>

<script>
import { useStores } from '~/stores/counter';
import comManager from '@/managers/comManager.js'

export default {
    data() {
        const store = useStores();
        return {
            store: useStores(),
            followers: 0
        }

    },
    props: {
        event: {
            type: Object,
            required: true
        }
    },
    methods: {
        async toggleLike() {
            if (!this.store.getLoggedIn()) return this.$router.push('/join');
            let response;
            if (!this.event.like) {
                response = await comManager.likeAnEvent(this.event.id)
                if (response.status === 200) {
                    this.event.like = true
                    this.followers += 1;
                    this.store.events[this.findIndex(this.event.id)].like = true;
                }
            } else {
                response = await comManager.unlikeAnEvent(this.event.id)
                if (response.status === 200) {
                    this.event.like = false
                    this.followers -= 1;
                    this.store.events[this.findIndex(this.event.id)].like = false;
                }
            }
        },
        findIndex(eventId) {
            return this.store.getEvents().findIndex(event => event.id === eventId);
        },
        async getEventFollowers() {
            const response = await comManager.getEventCounterFollowers(this.event.id);
            this.followers = response.data.eventFollowers;
        }
    },
    mounted() {
        this.getEventFollowers();
    }
}
</script>

<style scoped></style>