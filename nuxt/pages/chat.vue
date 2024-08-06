<template>
    <section class="w-full min-h-screen mx-auto text-white">
        <header class="w-full fixed top-0 bg-black">
            <button @click="leaveChat()" class="absolute left-8 top-8">
                <Arrow class="size-6" />
            </button>
            <div class="h-[12vh] flex justify-center items-center">

                <button @click="goToProfile">
                    <article class="flex flex-col justify-center items-center gap-2">
                        <img class="size-16 rounded-full object-cover" :src="getImage()">
                        <h1 class="text-sm font-semibold">{{ contact.nickname }}</h1>
                    </article>
                </button>
            </div>
        </header>

        <article ref="messageContainer" class="flex flex-col items-center pt-10 mx-4 " @scroll="handleScroll">
            <div class="w-full flex flex-col items-center gap-2 overflow-y-auto mt-24" style="max-height: 70vh;">
                <div v-for="msg in messages" :key="msg.id"
                    :class="{ 'max-w-[50%] self-end py-2 px-4 rounded-l-xl rounded-tr-xl bg-primary': msg.user_id === store.getId(), 'max-w-[50%] self-start py-2 px-4 rounded-r-xl rounded-t-xl bg-[#828282]': msg.user_id !== store.getId() }">
                    <p>{{ msg.content }}</p>
                </div>
            </div>
        </article>

        <div class="fixed bottom-0 w-full">
            <footer class="h-[10vh] bg-[#4B4B4B] flex justify-center items-center gap-2 px-8 w-full">
                <div class="w-full h-8 bg-[#646464] rounded-full flex items-center">
                    <input type="text" class="w-full h-full bg-transparent pl-3 rounded-full text-sm outline-none"
                        placeholder="Escriu el teu missatge..." @keyup.enter="sendMessage" v-model="message">
                </div>
                <button class="bg-primary rounded-full p-[6px]" @click="sendMessage">
                    <Send class="size-5" />
                </button>
            </footer>
        </div>
    </section>
</template>

<script>
import Arrow from '~/components/Icons/LeftArrow.vue'
import Flag from '~/components/Icons/Flag.vue'
import CircleDots from '~/components/Icons/CircleDots.vue'
import Send from '~/components/Icons/Send.vue'
import Plus from '~/components/Icons/Plus.vue'
import { socket } from '../socket';
import { useStores } from '@/stores/counter';
import comChat from '@/managers/chatManager.js';

export default {
    components: {
        Arrow,
        Flag,
        CircleDots,
        Send,
        Plus,
    },
    data() {
        return {
            store: useStores(),
            messages: [],
            message: '',
            pagination: {},
            contact: {},
            chat_id: 0,
            loadingMore: false,
        }
    },
    methods: {
        sendMessage() {
            const newMessage = {
                chat_id: this.chat_id,
                nameChat: `${this.store.getId()}-${this.contact.id}`,
                user_id: this.store.getId(),
                contact_id: this.contact.id,
                content: this.message
            }

            socket.emit('message', newMessage, this.contact.id);
            this.message = '';
            this.scrollToBottom();
        },
        async fetchMessages() {
            const result = await comChat.getFirst10Messages(this.chat_id);
            this.messages = result.reverse();
            this.scrollToBottom();
        },
        async loadMore() {
            if (this.loadingMore) return;
            this.loadingMore = true;
            const container = this.$refs.messageContainer;
            const currentScrollHeight = container.scrollHeight;

            const id = this.messages[0]._id;
            const result = await comChat.getMessages(this.chat_id, id);
            this.messages.unshift(...result.reverse());
            this.loadingMore = false;
            this.$nextTick(() => {
                const newScrollHeight = container.scrollHeight;
                container.scrollTop += (newScrollHeight - currentScrollHeight);
            });
        },
        scrollToBottom() {
            this.$nextTick(() => {
                if (this.$refs.messageContainer) {
                    this.$refs.messageContainer.scrollTop = this.$refs.messageContainer.scrollHeight;
                }
            });
        },
        handleScroll() {
            if (this.$refs.messageContainer.scrollTop === 0) {
                this.loadMore();
            }
        },
        leaveChat() {
            socket.emit('leaveChat', this.chat_id);
            this.$router.push('/chats');
        },
        markReadMessages() {
            comChat.markMessagesAsRead(this.chat_id, this.store.getId());
        },
        getImage() {
            if (!this.contact.avatar) {
                return `/img/standard_pfp.jpg`
            } else {
                return `${this.$config.public.IMAGE_URI}/${this.contact.avatar}`;
            }
        },
        goToProfile() {
            this.store.setOtherUserInfo(this.contact)
            this.$router.push(`/perfil/${this.contact.nickname}`);
        }

    },
    mounted() {
        if (!this.store.getLoggedIn()) return this.$router.push('/join');

        this.contact = this.store.getChatUser();

        socket.on('message', (message) => {

            this.messages.push(message);
            this.chat_id = message.chat_id;
            this.scrollToBottom();
        });


        comChat.checkChat(this.store.getId(), this.contact.id).then((res) => {
            if (res.chatExists._id !== undefined) {
                this.chat_id = res.chatExists._id;
                this.fetchMessages();
                this.markReadMessages();
            }

        });
    },
}
</script>
