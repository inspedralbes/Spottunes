<template>
    <section @click="closeModal"
        class="w-full h-screen bg-white/20 fixed top-0 left-0 flex justify-center items-center backdrop-blur-sm">
        <article class="bg-black w-[90%] px-4 rounded-md py-1">
            <header class="w-full flex justify-between items-center py-2">
                <button @click="closeModal" class="hover:bg-gray-700/40 transition duration-300 rounded-full p-1">
                    <IconsCross class="size-6" />
                </button>
                <div class="flex items-center gap-3">
                    <!-- <button class="rounded-full p-1 bg-[#818181]">
                        <IconsAddImage class="size-5" />
                    </button> -->
                    <button @click="sendReply"
                        class="bg-primary rounded-full px-4 py-1 font-semibold text-sm hover:bg-primaryDark transition duration-200">Respondre</button>
                </div>
            </header>
            <main>
                <article class=" flex justify-between items-center py-2">

                    <div class="flex justify-center items-center gap-3">
                        <img class="size-12 rounded-full object-cover" :src="this.getImage(avatar)">
                        <div class="flex flex-col">
                            <div class="flex items-center gap-3">
                                <h3 class="font-bold">{{ name }}</h3>

                                <p class="text-xs text-gray-300">{{ this.formatDay(post.date) }}</p>

                            </div>
                            <p class="text-sm">@{{ nickname }}</p>
                        </div>
                    </div>
                </article>

                <p class="px-3 text-sm">{{ post.content }}</p>
            </main>

            <p class="mt-12 mb-2 px-3 text-sm text-gray-500">Responent a <span class="text-blue-400">@{{ this.nickname
                    }}</span></p>
            <div class="flex items-start gap-3">
                <img class="size-12 rounded-full object-cover" :src="getImage(store.getUserInfo().avatar)">
                <textarea ref="textarea" v-model="comment" @input="autoGrow"
                    class="w-full min-h-20 bg-transparent outline-none flex-grow resize-none" autofocus
                    placeholder="Publica tu respuesta..."></textarea>
            </div>
        </article>
    </section>
</template>

<script>
import { useStores } from '~/stores/counter';
import comManager from '@/managers/comManager.js';

export default {

    props: {
        post: {
            type: Object,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        nickname: {
            type: String,
            required: true
        },
        avatar: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            store: useStores(),
            comment: "",
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        },

        async sendReply() {
            await comManager.commentPost(this.post._id, this.comment);
            this.$emit('replyed', this.post._id);
            this.$emit('close');
        },

        autoGrow() {
            this.$nextTick(() => {
                this.$refs.textarea.style.height = 'auto';
                this.$refs.textarea.style.height = (this.$refs.textarea.scrollHeight) + 'px';
            });
        },

        getImage(avatar) {
            if (!avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${avatar}`;
            }
        },

        formatDay(dateString) {
            const date = new Date(dateString);

            const hours = date.getHours();
            const minutes = date.getMinutes();

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12;
            const formattedMinutes = String(minutes).padStart(2, '0');

            const day = date.getDate();
            const month = date.toLocaleString('ca-ES', { month: 'long' });
            const year = date.getFullYear();

            return `${formattedHours}:${formattedMinutes} ${ampm} - ${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
        },
    },
    mounted() {
        this.$refs.textarea.focus();
    }

}
</script>