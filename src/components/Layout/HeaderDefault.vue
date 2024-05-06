<script lang="ts" setup>
import imgLogo from '@/assets/icons/Logo.svg'
import iconDiamond from '@/assets/icons/diamond.svg'
import iconAmerica from '@/assets/icons/america.svg'
import imgCat from '@/assets/images/cat.jpg'
</script>

<template>
  <div :class="$style.header">
    <div :class="$style.headerLeft">
      <img :src="imgLogo" alt="logo">
    </div>
    <p :class="$style.headerTitle">
      Paraphraser
    </p>
    <div :class="$style.headerRight">
      <button :class="$style.headerButton">
        <img :src="iconDiamond" alt="iconDiamond">
        <span>Upgrade to Premium</span>
      </button>
      <img :class="$style.headerImage" :src="iconAmerica" alt="iconAmerica">
      <img :class="$style.headerImage" :src="imgCat" alt="imgCat">
    </div>
  </div>
</template>

<style module lang="scss">
.header {
    background-color: #ffff;
    display: flex;
    height: 52px;
    border-bottom: 1px solid #DEE1E3;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    position: fixed;
    right: 0;
    top: 0;
    left: 0;
    z-index: 10;
}

.headerTitle {
    color: #252525;
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    padding-left: 100px;
}

.headerLeft {
    display: flex;
    align-items: center;
    margin-left: 5px;
}

.headerRight {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding-right: 15px;
}

.headerButton {
    background-color: #499557;
    border: none;
    cursor: pointer;
    padding: 6px 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 24px;

    img {
        width: 24px;
        height: 24px;
        padding-right: 4px;
        margin-top: 2px;
    }

    span {
        font-size: 14px;
        color: #ffff;
        font-weight: 600;
    }

    &:hover {
        background-color: #367040;
    }
}

.headerIcon {
    width: 24px;
    height: 24px;
}

.headerImage {
    width: 30px;
    height: 30px;
    border-radius: 50%;
}

.headerDiamondIcon {
    width: 20px;
    height: 20px;
}
</style>
