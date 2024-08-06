<template>
    <button @click="logout">
        <IconsLogout class="size-8" />
    </button>
    <div v-if="loader"
        class="h-screen w-screen fixed inset-y-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <Loader />
    </div>
</template>

<script>
import authManager from '~/managers/authManager';
export default {
    data() {
        return {
            loader: false,
        };
    },

    methods: {
        async logout() {
            this.loader = true;
            await authManager.logout()
                .then(() => {
                    this.loader = false;
                    this.$router.push('/events');
                })
        }
    }
}
</script>