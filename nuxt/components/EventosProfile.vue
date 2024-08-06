<template>
    <p class="text-center" v-if="!eventos && !profile">No tens esdeveniments disponibles.</p>
    <p class="text-center" v-if="!eventos && profile">No té esdeveniments disponibles.</p>
    <section v-else class='w-[90%] mx-auto flex flex-col gap-3'>
        <NuxtLink :to="`/events/${event.id}`" class="relative w-full h-48 rounded-md overflow-hidden"
            v-for="event in eventos" :key="event.id">
            <div class='relative'>
                <img :src="JSON.parse(event.images)[2]" class='w-full h-full object-cover'
                    :alt="`Foto de ${event.event}`" />
                <div
                    class='absolute top-0 left-0 w-full h-full bg-gradient-to-b from-40% from-transparent to-[#212121]'>
                </div>
            </div>
            <h1 class="absolute bottom-2 left-2 font-bold">{{ event.event }}</h1>
        </NuxtLink>

    </section>
</template>

<script>
import { useStores } from '~/stores/counter';

export default {
    props: {
        profile: {
            type: String,
        }
    },
    data() {
        return {
            store: useStores(),
            events: [],
        }
    },
    methods: {

    },
    mounted() {
        console.log(this.eventos)
    },
    computed: {
        eventos() {
            if (this.profile) {
                return this.store.otherUserInfo.events
            } else {
                return this.store.userInfo.events
            }
        }
    }
}
</script>