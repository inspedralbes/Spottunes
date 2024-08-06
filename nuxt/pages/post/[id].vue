<template>
    <section class="w-[90%] mx-auto">
        <header class="py-4 flex gap-5 items-center">
            <NuxtLink to="/perfil">
                <IconsLeftArrow class="size-6 bg-black rounded-full bg-opacity-60" />
            </NuxtLink>
            <h1 class="text-xl font-bold">Post</h1>
        </header>
        <main class="py-2">
            <header class="flex gap-3 items-center mb-3">
                <img class="size-12 rounded-full object-cover" :src="getImage(this.userPost.avatar)" alt="">
                <div>
                    <h2 class="font-bold">{{ this.userPost.nickname }}</h2>
                    <p class="text-sm text-gray-400">@{{ this.userPost.nickname }}</p>
                </div>
            </header>
            <article>
                <p>{{ post.content }}</p>
                <img class="rounded" :src="url_mongo + '/' + post.image" alt="">
            </article>
            <footer class="flex justify-between items-center gap-6 px-1 py-2">

                <div class="flex gap-4">
                    <button @click="mostrarModal(post)" class="flex items-center gap-1 text-sm">
                        <IconsMessage class="size-5" />
                        <p>{{ post.comments ? post.comments.length : 0 }}</p>
                    </button>

                    <button @click="clickLike()" class="flex items-center gap-1 text-sm">
                        <IconsHeartFill v-if="post.liked" class="size-5 text-red-500" />
                        <IconsHeart v-else class="size-5" />
                        <p>{{ post.likes ? post.likes.length : 0 }}</p>
                    </button>
                </div>

                <p class="text-sm text-gray-400">{{ this.formatDay(post.date) }}</p>
            </footer>
        </main>

        <article class="mt-6 border-t border-b py-2 border-gray-500">
            <p class="mb-2 px-1 text-sm text-gray-500">Responent a <span class="text-blue-400">@{{
                this.userPost.nickname }}</span></p>
            <div class="flex items-start gap-3">
                <img class="size-12 rounded-full object-cover" :src="getImage(store.getUserInfo().avatar)">
                <textarea ref="textarea" v-model="comment" @input="autoGrow"
                    class="w-full bg-transparent outline-none flex-grow resize-none" autofocus
                    placeholder="Publica la teva resposta..."></textarea>

                <button @click="sendReply"
                    class="bg-primary rounded-full px-4 py-1 font-semibold text-sm hover:bg-primaryDark transition duration-200">Respondre</button>
            </div>
        </article>

        <transition-group name="fade">
            <article v-for="(comment, index) in comments" :key="index" class="my-10">
                <header class="flex gap-3 items-center mb-3">
                    <img class="size-12 rounded-full object-cover" :src="getImage(comment.user.avatar)">
                    <div>
                        <h2 class="font-bold">{{ comment.user.nickname }}</h2>
                        <p class="text-sm text-gray-400">@{{ comment.user.nickname }}</p>
                    </div>
                </header>
                <p>{{ comment.content }}</p>
            </article>
        </transition-group>
    </section>

</template>

<script>
import { useStores } from '~/stores/counter';
import comManager from '@/managers/comManager.js';

export default {
    data() {
        return {
            store: useStores(),
            postId: this.$route.params.id,
            post: {},
            comments: [],
            comment: '',
            likedPosts: [],
            userPost: {},
            url_mongo: this.$config.public.ENV === 'development' ? this.$config.public.MONGO_IMG_PROD_URI : this.$config.public.MONGO_IMG_DEV_URI,

        }
    },

    methods: {
        async getPost() {
            try {
                this.post = await comManager.getPostById(this.postId)
                this.post.liked = false;
                this.getUser(this.post.userId);
                this.getLikesPost();
                this.getComments();



            } catch (error) {
                console.error(error)
            }
        },

        async getComments() {
            try {
                const getComments = await comManager.getComments(this.postId);
                var comments = [];

                const promises = getComments.map(async comment => {
                    const response = await comManager.getUserById(comment.userId, this.store.getToken());
                    comment.user = response.data;
                    comments.push(comment);
                });

                await Promise.all(promises);

                comments = comments.reverse();

                this.comments = comments;

            } catch (error) {
                console.error(error);
            }
        },

        async sendReply() {
            await comManager.commentPost(this.post._id, this.comment, this.store.getUserInfo().id);
            this.comment = '';
            this.getComments();
        },

        async getUser(id) {
            try {
                const response = await comManager.getUserById(id, this.store.getToken());
                this.userPost = response.data;
            } catch (error) {
                console.error(error)
            }
        },


        getImage(avatar) {
            if (!avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${avatar}`;
            }
        },

        async getUserInfo(userId) {
            this.infoUser = await comManager.getUserById(userId, this.store.getToken())
            this.infoUser = this.infoUser.data
        },

        async getLikesPost() {
            if (this.profile) {
                this.likedPosts = await comManager.getLikePosts(this.otherUserInfo.id)

            }
            else {
                this.likedPosts = await comManager.getLikePosts()
            }

            for (let j = 0; j < this.likedPosts.length; j++) {
                if (this.postId === this.likedPosts[j]) {
                    this.post.liked = true;
                }
            }
        },

        clickLike() {
            if (this.post.liked) {
                comManager.unlikePost(this.postId)

                this.post.likes.length--;
                this.post.liked = false;
            } else {
                comManager.likePost(this.postId)

                this.post.likes.length++;
                this.post.liked = true;
            }
        },

        autoGrow() {
            this.$nextTick(() => {
                this.$refs.textarea.style.height = 'auto';
                this.$refs.textarea.style.height = (this.$refs.textarea.scrollHeight) + 'px';
            });
        },

        formatDay(dateString) {
            const date = new Date(dateString);

            const hours = date.getHours();
            const minutes = date.getMinutes();

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHours = hours % 12 || 12; // Convertir 0 a 12 para la medianoche
            const formattedMinutes = String(minutes).padStart(2, '0');

            const day = date.getDate();
            const month = date.toLocaleString('ca-ES', { month: 'long' });
            const year = date.getFullYear();

            return `${formattedHours}:${formattedMinutes} ${ampm} - ${day} ${month.charAt(0).toUpperCase() + month.slice(1)}, ${year}`;
        },
    },

    mounted() {
        this.$nextTick(() => {
            this.$refs.textarea.focus();
        });
        this.getPost()
    }

}
</script>

<style>
.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all .5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(-50px);
}

.fade-leave-active {
    position: absolute;
}
</style>