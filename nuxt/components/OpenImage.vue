<template>
    <section @click="closeModal"
        class="w-full h-screen px-4 bg-white/20 fixed top-0 left-0 flex justify-center items-center backdrop-blur-sm">
        <img :src="url_mongo + '/' + image" alt="Imatge del post">
    </section>
</template>

<script>
export default {
    props: {
        image: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            isOpen: false,
            url_mongo: this.$config.public.ENV === 'development' ? this.$config.public.MONGO_IMG_PROD_URI : this.$config.public.MONGO_IMG_DEV_URI
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },
    }
}
</script>
