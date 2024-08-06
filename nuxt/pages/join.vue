<template>
    <main class='relative flex flex-col w-screen h-screen gap-10 mx-auto bg-[#212121] text-white'>
        <header class='py-6 w-[90vw] mx-auto'>
            <NuxtLink to='/' class='flex items-center gap-2'>
                <Logo class="text-white size-16" />
            </NuxtLink>
        </header>

        <section class='w-[90vw] mx-auto flex flex-col justify-center items-center gap-32'>
            <article class='flex flex-col gap-4'>
                <h1 class='text-2xl font-semibold'>Coneix a gent amb els mateixos gustos musicals i passa-ho d'allò més
                    bé!</h1>
                <p class='font-normal'>Una forma diferent, ràpida i entretinguda de conèixer gent nova.</p>
            </article>

            <div class='flex flex-col justify-center w-full gap-6'>
                <NuxtLink to='/login' class='bg-[#464646] rounded-full font-bold py-3 text-center'>Inicia sessió
                </NuxtLink>
                <NuxtLink to='/register'
                    class='py-3 font-bold text-center transition-all rounded-full duration-200 bg-gradient-to-r from-orange-600 to-yellow-600 hover:bg-white hover:text-black'>
                    Crea un compte</NuxtLink>
            </div>
        </section>
    </main>
</template>

<script>
export default {

}
</script>