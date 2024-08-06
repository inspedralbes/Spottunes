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
                    <h1 class='text-xl font-semibold text-white'>{{ User.nickname }}</h1>
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

            <NuxtLink to='/edit-profile'
                class='px-4 py-2 font-bold text-black text-sm bg-white rounded-full hover:bg-[#FF8A1E] transition-all duration-300 hover:-translate-y-1'>
                Edita el perfil
            </NuxtLink>
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
                <!-- <button class="text-white"
                    :class="selectedSection === 'Gustos' ? 'border-b-2 border-b-white' : 'opacity-60'"
                    @click="setSelectedSection('Gustos')">
                    Gustos
                </button> -->
            </div>

            <PostsProfile v-if="selectedSection === 'Posts'" />
            <EventosProfile v-if="selectedSection === 'Eventos'" />
            <!-- <GustosProfile v-if="selectedSection === 'Gustos'" /> -->
        </section>
    </main>
    <Menu v-if="!loader" />
</template>

<script>
import userManager from '~/managers/userManager';
import eventManager from '~/managers/eventManager';
import { useStores } from '~/stores/counter';

export default {

    data() {
        return {
            selectedSection: 'Posts',
            User: {
                store: useStores(),
                id: useStores().userInfo.id,
                avatar: useStores().userInfo.avatar,
                nickname: useStores().userInfo.nickname,
                name: useStores().userInfo.name,
                followers: useStores().userInfo.followersUsers.count,
                following: useStores().userInfo.followingUsers.count,
                events: useStores().userInfo.events || []
            },
            store: useStores(),
            loader: false

        }
    },

    methods: {
        setSelectedSection(section) {
            this.selectedSection = section
        },
        async getFollowers() {
            await userManager.getFollowers();
        },
        async getFollowing() {
            await userManager.getFollowed();
        },
        async getEvents() {
            const eventos = await eventManager.getLikeEvents(this.User.id);
            this.store.setUserInfoEvents(eventos)
        },
    },
    async mounted() {
        if (!this.store.getLoggedIn()) return this.$router.push('/join');
        this.loader = true;
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
        }
    }
}
</script>