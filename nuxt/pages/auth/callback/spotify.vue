<template>
    <div class="w-screen h-screen flex justify-center items-center">
        <Loader v-if="isLoading" />
    </div>
</template>

<script>
import authManager from '@/managers/authManager.js';
import { useStores } from '@/stores/counter.js';
import { socket } from '@/socket.js';

export default {
    data() {
        return {
            store: useStores(),
            isLoading: true,
            code: "",
            state: ""
        }
    },
    created() {
        this.getParams();
    },
    mounted() {
        this.fetchSpotifyToken();
    },
    methods: {
        getParams() {
            const code = this.$route.query.code;
            const state = this.$route.query.state;

            this.code = code;
            this.state = state;
        },
        async fetchSpotifyToken() {
            try {
                const response = await authManager.getSpotifyToken(this.code, this.state);
                const responseIfExists = await authManager.checkEmail(response.userInfo.email);
                if (responseIfExists.status === 202) {
                    this.store.setInfoOnRegister(response);
                    this.$router.push('/completar');
                } else if (responseIfExists.status === 200) {
                    this.store.setUserInfo({
                        id: responseIfExists.data.data.user.id,
                        name: responseIfExists.data.data.user.name,
                        surnames: responseIfExists.data.data.user.surnames,
                        email: responseIfExists.data.data.user.email,
                        token: responseIfExists.data.data.token,
                        birthdate: responseIfExists.data.data.user.birthdate,
                        nickname: responseIfExists.data.data.user.nickname,
                        avatar: responseIfExists.data.data.user.avatar,
                        private: responseIfExists.data.data.user.private,
                    });
                    this.store.setLoggedIn(true);

                    this.isLoading = false;
                    socket.emit('logged', this.store.getId());

                    this.$router.push('/events');
                }
            } catch (error) {
                console.error(error);
                this.$router.push('/join');
            }
        }
    }
}
</script>

<style scoped></style>