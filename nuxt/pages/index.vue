<template>
    <img class='absolute -z-10 w-screen h-screen object-cover brightness-50' src="/public/img/landing-bg.webp"
        alt="Imagen de gente pasandolo bien en un concierto" />

    <header class='w-[90%] py-4 mx-auto flex justify-between'>
        <h1 class='text-2xl font-bold text-white uppercase'>Spottunes</h1>
        <div v-if="!store.getLoggedIn()">
            <NuxtLink to="/login" class="text-white">Inicia sessió</NuxtLink>
        </div>
    </header>

    <main class='w-[90%] mx-auto'>
        <section class='flex flex-col items-center justify-center h-[90dvh] gap-5'>
            <h2 class='text-white text-3xl font-bold text-center uppercase'>Troba el teu company de concerts perfecte
            </h2>
            <p class='text-white text-center text-pretty'>Connecta la teva passió per la música amb noves amistats.
                Descobreix concerts èpics i companys de concerts inoblidables amb la nostra aplicació.</p>
            <NuxtLink to="/events"
                class='px-4 py-2 font-bold text-black bg-white rounded-full hover:bg-[#FF8A1E] transition-all duration-300 hover:-translate-y-1'>
                Veure concerts
            </NuxtLink>
        </section>
    </main>
</template>

<script>
import { useStores } from '~/stores/counter';

export default {
    data() {
        return {
            store: useStores(),
        }
    },
    created() {
    },
    mounted() {
    }
}
</script>