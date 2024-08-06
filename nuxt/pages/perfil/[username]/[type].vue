<template>
    <div>
        <Header />
        <div class="flex flex-row w-fit-content justify-center items-center m-2">
            <NuxtLink :to="checkUser ? '/perfil' : `/perfil/${user}`">
                <IconsLeftArrow class="h-full" />
            </NuxtLink>
            <UTabs v-model="type" :items="[{ label: 'Seguidors' }, { label: 'Seguits' }]" class="mx-2 w-2/3"></UTabs>
        </div>
        <div>
            <div v-if="type === 0 && doThis.followers.length != 0" v-for="follower in doThis.followers"
                class="w-full flex flex-col justify-center items-center">
                <CardUser class="w-2/3" :user="follower.follower" />
                <hr>
            </div>
            <div v-else-if="type === 0 && doThis.followers.length === 0" class="flex justify-center items-center">
                <h2 v-if="checkUser" class="font-bold">No tens seguidors</h2>
                <h2 v-else class="font-bold">No té seguidors</h2>
            </div>
            <div v-else-if="type === 1 && doThis.following.length != 0" v-for="followed in doThis.following"
                class="w-full flex flex-col justify-center items-center">
                <CardUser class="w-2/3" :user="followed.followed" />
                <hr>
            </div>
            <div v-else-if="type === 1 && doThis.following.length === 0" class="flex justify-center items-center">
                <h2 v-if="checkUser" class="font-bold">No segueixes a ningú</h2>
                <h2 v-else class="font-bold">No segueix a ningú</h2>
            </div>
        </div>
        <!-- <div v-else>
            <div v-if="type === 0 && otherFollowers.length != 0" v-for="follower in otherFollowers"
                class="w-full flex flex-col justify-center items-center">
                <CardUser class="w-2/3" :user="follower.follower" />
                <hr>
            </div>
            <div v-else-if="type === 0 && otherFollowers.length === 0" class="flex justify-center items-center">
                <h2 class="font-bold">No té seguidors</h2>
            </div>
            <div v-else-if="type === 1 && otherFollowing.length != 0" v-for="followed in otherFollowing"
                class="w-full flex flex-col justify-center items-center">
                <CardUser class="w-2/3" :user="followed.followed" />
                <hr>
            </div>
            <div v-else-if="type === 1 && otherFollowing.length === 0" class="flex justify-center items-center">
                <h2 class="font-bold">No segueix a ningú</h2>
            </div>
        </div> -->
    </div>
    <Menu />
</template>

<script>
import { useStores } from '@/stores/counter.js';
import userManager from '@/managers/userManager.js';


export default {
    data() {
        return {
            store: useStores(),
            followers: computed(() => this.store.userInfo.followersUsers.followers),
            following: computed(() => this.store.userInfo.followingUsers.followed),
            otherFollowing: computed(() => this.store.otherUserInfo.followingUsers.followed) || [],
            otherFollowers: computed(() => this.store.otherUserInfo.followersUsers.followers) || [],
            type: this.$route.params.type === 'followers' ? 0 : 1,
            user: this.$route.params.username,
            doThis: {
                followers: null,
                following: null,
            }
        }
    },
    mounted() {
        if (!this.store.getLoggedIn()) return this.$router.push('/join');
        if (this.checkUser) {
            this.getFollowers();
            this.getFollowing();
        } else {
            this.getOtherFollowers();
            this.getOtherFollowing();
        }

    },
    methods: {
        async getFollowers() {
            await userManager.getFollowers();
            this.doThis.followers = this.followers;
        },
        async getFollowing() {
            await userManager.getFollowed();
            this.doThis.following = this.following;
        },
        async getOtherFollowers() {
            await userManager.getFollowers(this.store.otherUserInfo.id);
            this.doThis.followers = this.otherFollowers;
        },
        async getOtherFollowing() {
            await userManager.getFollowed(this.store.otherUserInfo.id);
            this.doThis.following = this.otherFollowing;
        },
    },
    computed: {
        checkUser() {
            return this.store.userInfo.nickname === this.user
        },
    }
}
</script>

<style scoped></style>