<template>
    <main class='w-screen h-screen bg-[#212121]'>
        <section class='w-[80vw] h-screen mx-auto flex flex-col gap-10 justify-center'>
            <h1 class='text-4xl font-semibold'>Completa el teu perfil</h1>
            <h1 v-if="error" class="text-red-500">{{ message }}</h1>
            <form class='flex flex-col gap-6' @submit.prevent>
                <input class='bg-transparent border-b border-gray-400 outline-none' type="password"
                    placeholder="Contrasenya" v-model="password" />
                <input class='bg-transparent border-b border-gray-400 outline-none' type="password"
                    placeholder="Confirma contrasenya" v-model="confirmPassword" />
                <input class="bg-transparent border-b border-gray-400 outline-none" type="text"
                    placeholder="Nom d'usuari" v-model="nickname" @input="removeSpaces" />
                <input class='bg-transparent border-b border-gray-400 outline-none' type="date" placeholder="Aniversari"
                    v-model="birthdate" />
                <!-- <div class="flex flex-row gap-x-2">
                    <label for="private" class='text-white'>Vols que el teu perfil sigui privat?</label>
                    <UToggle v-model="private" color="orange" on-icon="i-heroicons-check-20-solid"
                        off-icon="i-heroicons-x-mark-20-solid" />
                </div> -->
                <button @click="completeProfile" :disabled="isLoading"
                    class='flex justify-center py-3 font-bold rounded-full bg-gradient-to-r from-orange-600 to-yellow-600'>
                    <Loader v-if="isLoading" />
                    <span v-else>Completa el teu perfil</span>
                </button>
            </form>
            <NuxtLink to="/join"><svg class='w-auto h-8' xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                    viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round"
                    strokeLinejoin="round">
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
import authManager from '~/managers/authManager';
import { useStores } from '~/stores/counter';

export default {
    data() {
        return {
            store: useStores(),
            isLoading: false,
            nickname: "",
            password: "",
            confirmPassword: "",
            birthdate: "",
            name: "",
            email: "",
            surnames: "",
            loginWith: "",
            googleId: "",
            error: false,
            message: "",
            private: false,
            toastVisible: false,
        }
    },
    created() {

    },
    mounted() {

        if (this.store.getInfoOnRegister()) {
            this.name = this.store.getInfoOnRegister().userInfo.display_name;
            this.email = this.store.getInfoOnRegister().userInfo.email;

            if (this.store.getInfoOnRegister().userInfo.surnames) {
                this.surnames = this.store.getInfoOnRegister().userInfo.surnames;
            }

            if (this.store.getInfoOnRegister().userInfo.loginWith === 'google') {
                this.loginWith = this.store.getInfoOnRegister().userInfo.loginWith;
                this.googleId = this.store.getInfoOnRegister().userInfo.googleId;
            } else if (this.store.getInfoOnRegister().userInfo.loginWith === 'spotify') {
                this.loginWith = this.store.getInfoOnRegister().userInfo.loginWith;
            }
        }
    },
    methods: {
        async completeProfile() {
            this.isLoading = true;
            const userParams = {
                name: this.name,
                email: this.email,
                nickname: this.nickname,
                password: this.password,
                confirmPassword: this.confirmPassword,
                birthdate: this.birthdate,
                surnames: this.surnames,
                loginWith: this.loginWith,
                googleId: this.googleId,
                // private: this.private,
            }

            try {
                const response = await authManager.completeProfile(userParams);
                const data = {
                    id: response.data.user.id,
                    name: response.data.user.name,
                    surnames: response.data.user.surnames,
                    nickname: response.data.user.nickname,
                    email: response.data.user.email,
                    token: response.data.token,
                    avatar: response.data.user.avatar,
                    // private: response.data.user.private,
                }
                this.store.setUserInfo(data);
                this.store.setLoggedIn(true);
                this.$router.push('/events');
            } catch (error) {
                console.error(error);
            } finally {
                this.isLoading = false;
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

<style scoped></style>