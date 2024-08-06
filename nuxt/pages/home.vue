<template>
    <Header />
    <section class="min-h-screen w-[90%] mx-auto">

        <article v-for="post in posts" :key="post._id" class="flex flex-col gap-2 bg-black rounded mb-4">
            <header class=" flex justify-between items-center py-2 px-3">
                <div class="flex justify-center items-center gap-3">
                    <img class="size-12 rounded-full object-cover"
                        src="data:image/jpeg;base64,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"
                        alt="">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-3">
                            <h3 class="font-bold">{{ post.name }}</h3>

                            <p class="text-xs text-gray-300">Fa 22h</p>

                        </div>
                        <p class="text-sm">@{{ post.nickname }}</p>
                    </div>
                </div>
            </header>

            <NuxtLink :to="`/post/${post._id}`">
                <p class="px-3 text-sm">{{ post.content }}</p>
            </NuxtLink>
            <button @click="mostrarImageModal(post.image)">
                <img class="px-3 rounded" :src="post.image" alt="">
            </button>

            <footer class="flex items-center gap-6 px-3 py-2">
                <button @click="mostrarReplyModal(post)" class="flex items-center gap-1 text-sm">
                    <IconsMessage class="size-5" />
                    <p>{{ post.comments.length }}</p>
                </button>

                <button @click="clickLike(post._id)" class="flex items-center gap-1 text-sm">
                    <IconsHeartFill v-if="post.liked" class="size-5 text-red-500" />
                    <IconsHeart v-else class="size-5" />
                    <p>{{ post.likes.length }}</p>
                </button>
            </footer>
        </article>


    </section>
    <Menu />
</template>

<script>
import { useStores } from '~/stores/counter';
import userManager from '@/managers/userManager.js';
import comManager from '@/managers/comManager.js';
import axios from 'axios';

export default {
    data() {
        return {
            store: useStores(),
            followedUsers: [],
            posts: [],
            followedIds: [],
            param: '',
            users: [],
            filteredUsers: [],
            empty: false,
            message: '',
            loader: false,
            modal: false,

        }
    },

    methods: {
        async getFollowedUsers() {
            this.followedUsers = await userManager.getFollowed()
            this.followedUsers = this.followedUsers.followed

            for (let i = 0; i < this.followedUsers.length; i++) {
                this.followedIds.push(this.followedUsers[i].id)
            }


        },

        async getPosts() {
            await this.getFollowedUsers()
            for (let i = 0; i < this.followedIds.length; i++) {
                const posts = await comManager.getPosts(this.followedIds[i]);
                this.posts.push(...posts);
            }
            this.addPostInfo();
        },

        addPostInfo() {
            for (let i = 0; i < this.posts.length; i++) {
                const user = this.followedUsers.find(user => user.followed.id === this.posts[i].userId);
                if (user) {
                    this.posts[i].name = user.followed.name;
                    this.posts[i].nickname = user.followed.nickname;
                }
            }
        },
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

        // async follow() {
        //     try {
        //         let url_api = import.meta.env.VITE_APP_API_DEV_URL;
        //         console.log(url_api)
        //         const token = this.store.getToken();
        //         const response = await axios.post(
        //             `${url_api}/users/follow/1`,
        //             {},
        //             {
        //                 headers: {
        //                     Authorization: `Bearer ${token}`,
        //                 },
        //             }
        //         );
        //         return response;
        //     } catch (error) {
        //         console.error("Error following user:", error);
        //     }
        // }
    },

    mounted() {
        if (!this.store.getLoggedIn()) return this.$router.push('/join');
        this.getPosts()
    }
}
</script>