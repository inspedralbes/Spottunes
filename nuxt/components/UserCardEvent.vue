<template>
    <section class="flex justify-between items-center">
        <button @click="goToProfile">
            <article class="flex gap-2">
                <img class="rounded-full size-14" :src="getImage" alt="">
                <div class="flex flex-col justify-center items-start">
                    <p class="font-semibold">{{ follower.nickname }}</p>
                    <p class="text-sm text-gray-300">@{{ follower.nickname }}</p>
                </div>
            </article>
        </button>

        <div class="flex items-center gap-3">
            <div v-if="loader" class="flex justify-center items-center">
                <div class="border-gray-300 h-5 w-5 animate-spin rounded-full border-2 border-t-blue-600"></div>
            </div>
            <button class="font-bold px-4 py-1 bg-white text-black rounded-full text-sm"
                v-if="store.getId() != follower.id && !loader" @click="followOr(follower.follow)">
                {{ follower.follow ? 'Seguint' : 'Seguir' }}
            </button>
            <!-- <button class="p-1 rounded-full bg-gradient-to-r from-primary to-yellow-500" style="opacity: 0.5;">
                <IconsChat class="size-5" />
            </button> -->
        </div>
    </section>
</template>

<script>
import { useStores } from '@/stores/counter.js';
import comManager from '@/managers/comManager.js';

export default {
    props: {
        follower: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            store: useStores(),
            loader: false
        }
    },
    methods: {
        async followOr(isFollowing) {
            let response;

            if (!isFollowing) {
                try {
                    this.follower.follow = true;
                    response = await comManager.follow(this.follower.id);
                    // this.store.followers += 1;
                } catch (error) {
                    this.follower.follow = false;

                    console.error(error);
                }
            } else {
                try {
                    this.follower.follow = false;
                    response = await comManager.unfollow(this.follower.id);
                    // this.store.followers -= 1;

                } catch (error) {
                    this.follower.follow = true;
                    console.error(error);
                }
            }
        },
        async getFollow() {
            const followedUserIds = await comManager.getFollowers();
            if (followedUserIds && followedUserIds.length) {
                this.follower.follow = followedUserIds.includes(this.follower.id);
            } else {
                this.follower.follow = false;
            }
        },
        goToProfile() {
            this.store.setOtherUserInfo(this.follower)
            this.$router.push(`/perfil/${this.follower.nickname}`);
        }
    },
    async mounted() {
        this.loader = true;
        await this.getFollow();
        this.loader = false;
    },
    computed: {
        getImage() {
            if (!this.follower.avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${this.follower.avatar}`;
            }
        }
    }
}
</script>
