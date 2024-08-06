<template>
    <div className="loader"></div>
</template>

<style scoped>
.loader {
        position: relative;
        width: 42.5px;
        height: 25px;
        background-repeat: no-repeat;
        background-image: linear-gradient(#fff 25px, transparent 0),
            linear-gradient(#fff 25px, transparent 0),
            linear-gradient(#fff 25px, transparent 0),
            linear-gradient(#fff 25px, transparent 0),
            linear-gradient(#fff 25px, transparent 0),
            linear-gradient(#fff 25px, transparent 0);
        background-position: 0px center, 7.5px center, 15px center, 22.5px center,
            30px center, 37.5px center;
        animation: rikSpikeRoll 0.65s linear infinite alternate;
    }

    @keyframes rikSpikeRoll {
        0% {
            background-size: 5px 1.5px;
        }
        16% {
            background-size: 5px 25px, 5px 1.5px, 5px 1.5px, 5px 1.5px, 5px 1.5px,
                5px 1.5px;
        }
        33% {
            background-size: 5px 15px, 5px 25px, 5px 1.5px, 5px 1.5px, 5px 1.5px,
                5px 1.5px;
        }
        50% {
            background-size: 5px 5px, 5px 15px, 5px 25px, 5px 1.5px, 5px 1.5px,
                5px 1.5px;
        }
        66% {
            background-size: 5px 1.5px, 5px 5px, 5px 15px, 5px 25px, 5px 1.5px,
                5px 1.5px;
        }
        83% {
            background-size: 5px 1.5px, 5px 1.5px, 5px 5px, 5px 15px, 5px 25px,
                5px 1.5px;
        }
        100% {
            background-size: 5px 1.5px, 5px 1.5px, 5px 1.5px, 5px 5px, 5px 15px,
                5px 25px;
        }
    }
</style>