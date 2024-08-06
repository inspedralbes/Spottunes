<template>
    <div v-if="loader"
        class="h-full w-full fixed inset-y-0 right-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <Loader />
    </div>
    <main v-if="!loader" class='bg-[#212121] flex flex-col gap-10 min-h-screen '>
        <Header />
        <section class='bg-[#212121] flex flex-col items-center gap-6'>
            <article class='w-full px-2 py-4 flex justify-around items-center'>
                <img class='size-24 rounded-full object-cover' :src="getImage" alt="" />
                <div class='flex flex-col justify-center gap-4'>
                    <div class="flex flex-row gap-x-6">
                        <h1 class='text-xl font-semibold text-white'>{{ User.nickname }}</h1>
                        <button
                            class="font-bold px-4 py-1 bg-white text-black rounded-full text-sm h-8 border border-black"
                            @click="followOr">
                            {{ checkIfFollowing ? 'Seguint' : 'Seguir' }}
                        </button>
                    </div>
                    <div class='flex justify-center items-center gap-6'>
                        <div>
                            <NuxtLink :to="`/perfil/${User.nickname}/followers`">
                                <p class="text-white">{{ User.followers || 0 }}</p>
                                <p class='text-xs text-white/60'>Seguidors</p>
                            </NuxtLink>
                        </div>
                        <div>
                            <NuxtLink :to="`/perfil/${User.nickname}/following`">
                                <p class="text-white">{{ User.following || 0 }}</p>
                                <p class='text-xs text-white/60'>Seguits</p>
                            </NuxtLink>
                        </div>
                        <div>
                            <p class="te+xt-white">{{ User.events.length || 0 }}</p>
                            <p class='text-xs text-white/60'>Esdeveniments</p>
                        </div>
                    </div>
                </div>
            </article>
        </section>

        <section class='flex flex-col gap-4'>
            <div class='flex justify-center gap-8'>

                <button class="text-white"
                    :class="selectedSection === 'Posts' ? 'border-b-2 border-b-white' : 'opacity-60'"
                    @click="setSelectedSection('Posts')">
                    Posts
                </button>
                <button class="text-white"
                    :class="selectedSection === 'Eventos' ? 'border-b-2 border-b-white' : 'opacity-60'"
                    @click="setSelectedSection('Eventos')">
                    Esdeveniments
                </button>
            </div>

            <PostsProfile profile="otro" class="" v-if="selectedSection === 'Posts'" />
            <EventosProfile profile="otro" v-if="selectedSection === 'Eventos'" />
            <!-- <GustosProfile profile="otro" v-if="selectedSection === 'Gustos'" /> -->
        </section>
    </main>
    <Menu v-if="!loader" />
</template>

<script>
import userManager from '~/managers/userManager';
import eventManager from '~/managers/eventManager';
import comManager from '~/managers/comManager';
import { useStores } from '~/stores/counter';

export default {

    data() {
        return {
            selectedSection: 'Posts',
            User: {
                id: useStores().otherUserInfo.id,
                avatar: useStores().otherUserInfo.avatar,
                nickname: this.$route.params.username,
                name: useStores().otherUserInfo.name,
                followers: useStores().otherUserInfo.followersUsers.count,
                following: useStores().otherUserInfo.followingUsers.count,
                events: useStores().otherUserInfo.events || []
            },
            store: useStores(),
            loader: false

        }
    },

    methods: {
        setSelectedSection(section) {
            this.selectedSection = section
        },
        async getEvents() {
            const eventos = await eventManager.getLikeEvents(this.User.id);
            this.store.setOtherUserInfoEvents(eventos)
        },
        async getFollowers() {
            await userManager.getFollowers(this.User.id);
        },
        async getFollowing() {
            await userManager.getFollowed(this.User.id);
        },
        async followUser() {
            await comManager.follow(this.User.id)
        },
        async unfollowUser() {
            await comManager.unfollow(this.User.id)
        },
        async followOr() {
            if (!this.store.getLoggedIn()) return this.$router.push('/join');

            if (this.checkIfFollowing) {
                await this.unfollowUser();
            } else {
                await this.followUser();
            }
        },
    },
    async mounted() {
        if (!this.store.getLoggedIn()) return this.$router.push('/join');
        if (this.$route.params.username === this.store.userInfo.nickname) return this.$router.push('/perfil')
        this.loader = true
        try {
            await this.getFollowers();
            await this.getFollowing();
            await this.getEvents();
        } catch (error) {
            console.error("Error while fetching data:", error);
        } finally {
            this.loader = false;
        }
    },
    computed: {
        getImage() {
            if (!this.User.avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${this.User.avatar}`;
            }
        },
        checkIfFollowing() {
            if (!this.store.userInfo.followingUsers.followed) {
                return false
            } else {
                return this.store.userInfo.followingUsers.followed.some(followed => followed.followed.id === this.User.id);
            }
        }
    }
}
</script>