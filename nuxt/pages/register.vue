<template>
    <main class='w-screen h-screen bg-[#212121]'>
        <section class='w-[80vw] h-screen mx-auto flex flex-col gap-10 justify-center'>
            <h1 class='text-4xl font-semibold text-white'>Registra't</h1>
            <h1 v-if="error" class="text-red-500">{{ message }}</h1>
            <form class="flex flex-col gap-6" @submit.prevent="register">
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="email"
                    placeholder="Email" v-model="email" />
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="text"
                    placeholder="Nom" v-model="name" />
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="text"
                    placeholder="Cognoms" v-model="surnames" />
                <input class="bg-transparent border-b border-gray-400 outline-none" type="text"
                    placeholder="Nom d'usuari" v-model="nickname" @input="removeSpaces" />
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="date"
                    placeholder="Data de naixement" v-model="birthdate" />
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="password"
                    placeholder="Contrasenya" v-model="password" />
                <input class="bg-transparent border-b border-gray-400 outline-none text-white" type="password"
                    placeholder="Repeteix la contrasenya" v-model="password_confirmation" />
                <!-- <div class="flex flex-row gap-x-2">
                    <label for="private" class='text-white'>Vols que el teu perfil sigui privat?</label>
                    <UToggle v-model="private" color="orange" on-icon="i-heroicons-check-20-solid"
                        off-icon="i-heroicons-x-mark-20-solid" />
                </div> -->
                <button
                    class="flex justify-center py-3 font-bold rounded-full bg-gradient-to-r from-orange-600 to-yellow-600">
                    <span v-if="!isLoading" class="text-white">Registra'm</span>
                    <Loader v-else />
                </button>
            </form>

            <LoginMethods forWhat="registra't" />

            <NuxtLink to='/join' class='text-white'><svg class='w-auto h-8' xmlns="http://www.w3.org/2000/svg"
                    width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none"
                    strokeLinecap="round" strokeLinejoin="round">
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
import authManager from '@/managers/authManager';
import { socket } from '../socket';

export default {
    data() {
        return {
            store: useStores(),
            email: '',
            name: '',
            surnames: '',
            nickname: '',
            birthdate: '',
            password: '',
            password_confirmation: '',
            isLoading: false,
            error: false,
            message: '',
            private: false,
            toastVisible: false
        };
    },

    methods: {
        async register() {
            this.isLoading = true;

            let userData = {
                email: this.email,
                name: this.name,
                surnames: this.surnames,
                nickname: this.nickname,
                birthdate: this.birthdate,
                password: this.password,
                password_confirmation: this.password_confirmation,
                // private: this.private,
            };

            const response = await authManager.register(userData);

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
                    // private: user.private,
                });
                this.store.setLoggedIn(true);
                this.isLoading = false;
                socket.emit('logged', this.store.getId());
                this.$router.push('/events');
            } else {
                this.isLoading = false;
                this.error = true;
                this.message = response.data.message.join(', ');
            }


        },
        removeSpaces(event) {
            const inputText = event.target.value;
            const hasSpace = /\s/.test(inputText);

            this.nickname = inputText.replace(/\s/g, '');

            if (hasSpace && !this.toastVisible) {
                this.toastVisible = true;

                const toast = useToast();
                toast.add({ title: 'No es poden escriure espais', color: 'red', icon: 'i-heroicons-information-circle-20-solid' });
                setTimeout(() => {
                    this.toastVisible = false;
                }, 3000);
            }
        },
    }
}
</script>