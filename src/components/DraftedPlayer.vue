<template>
  <div
    :class="{ bi, myTeam: showMyTeam, 'bi-bookmark-heart-fill': showMyTeam, 'bi-bookmark-heart': !showMyTeam }"
    @click="showMyTeam = !showMyTeam"
  ></div>
  <div 
    :class="{ bi, fuckersTeam: showFuckersTeam, 'bi-bookmark-x-fill': showFuckersTeam, 'bi-bookmark-x': !showFuckersTeam }"
    @click="showFuckersTeam = !showFuckersTeam"
  ></div>
</template>

<script>
export default {
  name: "DraftedPlayer",
  data() {
    return {
      showMyTeam: false,
      showFuckersTeam: false,
    };
  },
  methods: {
  },
};
</script>

<style>
.myTeam {
  color: blue;
}
.fuckersTeam {
  color: brown;
}
</style>