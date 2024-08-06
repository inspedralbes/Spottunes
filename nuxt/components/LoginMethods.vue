<template>
    <section class='flex flex-col gap-2'>
        <h2 class='text-xl text-white'>O {{ forWhat }} amb un altre compte</h2>
        <div class='flex gap-6'>
            <button class='size-7' @click="redirectToGoogle"><img src="/public/img/google_logo.png"
                    alt="Logo de Google" /></button>
            <button class='size-7' @click="redirectToSpotify"><img src="/public/img/spotify_logo.webp"
                    alt="Logo de Spotify" /></button>
            <button class='size-7' @click="redirectToLogin"><img src="/public/img/Spottunes_logo.svg" alt=""></button>
            <!-- <button class='size-7'><img src="/img/appleMusic_logo.png" alt="Logo de Apple Music" /></button> -->
            </div>
            </section>
</template>

<script>
export default {
    props: {
        forWhat: {
            type: String,
            required: true
        }
    },

    data() {
        return {
        }
    },
    created() {
    },
    methods: {
        redirectToLogin() {
            const currentPath = window.location.pathname;
            const newPath = currentPath === '/login' ? '/register' : '/login';
            window.location.href = newPath;
        },
        redirectToGoogle() {
            const clientId = this.$config.public.GOOGLE_CLIENT_ID;
            const redirectUri = this.$config.public.GOOGLE_REDIRECT_URI;
            const state = this.generateRandomString(16);
            const scopes = [
                'openid',
                'profile',
                'email',
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/user.birthday.read'
            ];
            const scope = encodeURIComponent(scopes.join(' '));
            const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
            window.location.href = url;
        },

        redirectToSpotify() {
            const clientId = this.$config.public.SPOTIFY_CLIENT_ID;
            const redirectUri = this.$config.public.SPOTIFY_REDIRECT_URI;
            const state = this.generateRandomString(16);
            const scope = 'user-read-email user-library-read user-top-read';
            const url = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}&state=${state}`;
            window.location.href = url;
        },

        generateRandomString(length) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        },
    }

}
</script>