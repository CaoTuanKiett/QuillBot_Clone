<script setup lang="ts">
import iconHistory from '@/assets/icons/history.svg'
import iconCompareModes from '@/assets/icons/compareModes.svg'
import iconDinamoBox from '@/assets/icons/dinamoBox.svg'
import iconStatistics from '@/assets/icons/statistics.svg'
import iconTone from '@/assets/icons/tone.svg'
import iconSetting from '@/assets/icons/setting.svg'
import iconFeedback from '@/assets/icons/feedback.svg'
import iconHotkeys from '@/assets/icons/hotkeys.svg'

const menuList = [
  {
    id: 0,
    icon: iconHistory,
    title: 'History',
    premium: true,
  },
  {
    id: 1,
    icon: iconCompareModes,
    title: 'Freeze Words',
    premium: true,
  },
  {
    id: 2,
    icon: iconStatistics,
    title: 'Statistics',
    premium: false,
  },
  {
    id: 3,
    icon: iconTone,
    title: 'Tone',
    premium: true,
  },
]

const dataListConfig = [
  {
    id: 0,
    icon: iconSetting,
    title: 'Settings',
  },
  {
    id: 1,
    icon: iconFeedback,
    title: 'Feedback',
  },
  {
    id: 2,
    icon: iconHotkeys,
    title: 'Hotkeys',
  },
]
</script>

<template>
  <div :class="$style.tabRighContainer">
    <div
      v-for="(item, index) in menuList" :key="index"
      :class="[$style.tabRighItem, item.premium === false && $style.tabRighItemDisableItem]"
    >
      <div :class="$style.tabRightIconBox">
        <img :src="item.icon" alt="icon" :class="$style.tabRightIcon">
        <img v-if="item.premium" :src="iconDinamoBox" alt="iconDiamond" :class="$style.tabRightDiamondIcon">
      </div>
      <p :class="$style.tabRighItemTitle">
        {{ item.title }}
      </p>
    </div>

    <div :class="$style.tabRighItemSetting">
      <div
        v-for="(item, index) in dataListConfig" :key="index"
        :class="[$style.tabRighItem]"
      >
        <div :class="$style.tabRightIconBox">
          <img :src="item.icon" alt="icon" :class="$style.tabRightIcon">
        </div>
        <p :class="$style.tabRighItemTitle">
          {{ item.title }}
        </p>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.tabRighContainer {
    position: absolute;
    right: 25px;
    height: calc(100% - 22px);
    top: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.tabRighItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 40px;
    cursor: pointer;
    margin-bottom: 4px;
}

.tabRightIconBox {
    position: relative;
    width: 36px;
    height: 36px;
    padding: 6px;
}

.tabRightIcon {
    width: 26px;
    height: 26px;
}

.tabRighItemDisableItem {
    color: #C1C1C1;
}

.tabRightDiamondIcon {
    position: absolute;
    bottom: 2px;
    right: 0px;
}

.tabRighItemTitle {
    font-weight: 400;
    line-height: 1.5;
    color: #252525;
    font-size: 12px;
    padding-top: 4px;
}

.tabRighItemSetting {
    margin-top: 38px;
}
</style>
