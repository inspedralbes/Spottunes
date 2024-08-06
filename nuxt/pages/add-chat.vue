<template>
    <div>
        <!-- Barra de busqueda -->
        <div class="flex justify-center mt-9">
            <router-link to="/chats">
                <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M5 12l6 6" />
                    <path d="M5 12l6 -6" />
                </svg>
            </router-link>
            <input v-model="param" @input="searchUsers" type="text" id="simple-search"
                class="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[400px] ps-3 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Cerca a usuaris per a iniciar un xat..." required />
        </div>

        <!-- Lista de usuarios que devuelve el buscador -->
        <main class="flex flex-col justify-center items-center mt-8 space-y-4">
            <div v-if="!empty" v-for="user in filteredUsers" :key="user.id"
                class="flex items-center gap-4 w-full max-w-xs">
                <img class="w-12 h-12 rounded-full object-cover md-[80px]" :src="getImage(user.avatar)" alt="">
                <button @click="goToChat(user)" :disabled="store.getId() === user.id">
                    <h2 class="font-bold">{{ user.nickname }}</h2>
                </button>
            </div>
            <div v-if="this.empty" class="flex justify-center items-center gap-1">
                <h2 class="font-bold m-5">{{ message }}</h2>
            </div>
        </main>
    </div>
    <!-- <Menu /> -->
</template>

<script>
import comManager from '~/managers/comManager';
import { useStores } from '@/stores/counter.js';

export default {
    data() {
        return {
            store: useStores(),
            param: '',
            users: [],
            filteredUsers: [],
            empty: false,
            message: '',
            loader: false,
        };
    },
    methods: {
        async searchUsers() {
            const response = await comManager.searchUsers(this.param);
            if (response.data.length > 0) {
                this.empty = false;
                this.users = response.data;
                this.filteredUsers = this.users.map(user => ({ id: user.id, nickname: user.nickname, avatar: user.avatar }));
            } else {
                this.empty = true;
                this.message = response.data.message;
            }
        },
        goToChat(user) {
            if (user.id == this.store.getId()) {
                this.empty = true;
                return;
            }
            this.store.setChatUser(user);
            this.$router.push('/chat');
        },
        getImage(avatar) {
            if (!avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${avatar}`;
            }
        },

    },
}
</script>

<style scoped></style>
