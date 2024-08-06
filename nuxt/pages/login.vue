<template>
    <main class='w-screen h-screen bg-[#212121]'>
        <section class='w-[80vw] h-screen mx-auto flex flex-col gap-10 justify-center '>
            <h1 class='text-4xl font-semibold text-white'>Inicia sessió</h1>

            <h1 v-if="error" class="text-red-500">{{ message }}</h1>
            <form class='flex flex-col gap-6' @submit.prevent="login">
                <input class='bg-transparent border-b border-gray-400 outline-none text-white' type="email"
                    autoFocus="true" placeholder="E-mail" v-model="email" />
                <input class='bg-transparent border-b border-gray-400 outline-none text-white' type="password"
                    placeholder="Contrasenya" v-model="password" />
                <NuxtLink to='/register' class='text-white'>No tens compte? <span
                        class="bg-gradient-to-r from-orange-600 to-yellow-600 text-transparent bg-clip-text">Registra't</span>
                </NuxtLink>
                <button
                    class='flex justify-center py-3 font-bold rounded-full bg-gradient-to-r from-orange-600 to-yellow-600 text-white'
                    type="submit">
                    <span v-if="!isLoading">Inicia sessió</span>
                    <Loader v-else />
                </button>
            </form>

            <LoginMethods forWhat="inicia sessió" />

            <NuxtLink to='/join' class='text-white'>
                <svg class='w-auto h-8' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                    strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l14 0" />
                    <path d="M5 12l6 6" />
                    <path d="M5 12l6 -6" />
                </svg>
            </NuxtLink>

        </section>
    </main>
</template>

<script>
import { useStores } from '~/stores/counter';
import authManager from '~/managers/authManager';
import userManager from '~/managers/userManager';
import { socket } from '../socket';
import comManager from '~/managers/comManager';

export default {
    data() {
        return {
            store: useStores(),
            email: '',
            password: '',
            isLoading: false,
            error: false,
            message: ''
        };
    },

    methods: {
        async login() {
            this.isLoading = true;
            const userData = {
                email: this.email,
                password: this.password
            }

            const response = await authManager.login(userData);

            if (response.status === 200) {
                const user = response.data.data.user;
                const token = response.data.data.token;
                this.store.setUserInfo({
                    id: user.id,
                    name: user.name,
                    surnames: user.surnames,
                    email: user.email,
                    token: token,
                    birthdate: user.birthdate,
                    nickname: user.nickname,
                    avatar: user.avatar,
                });
                await userManager.getFollowers();
                await userManager.getFollowed();
                this.store.setLoggedIn(true);
                this.isLoading = false;
                socket.emit('logged', this.store.getId());
                this.$router.push('/events');

            } else {
                this.isLoading = false;
                this.error = true;
                this.message = response.data.message;

            }
        }
    }
}
</script>

<style lang="scss" scoped></style>