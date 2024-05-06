<script lang="ts" setup>
import imgParaphraser from '@/assets/icons/paraphraser.svg'
import imgGramaarChecker from '@/assets/icons/gramaarChecker.svg'
import imgQuillBotFlow from '@/assets/icons/quillBotFlow.svg'
import imgPlagiarismChecker from '@/assets/icons/plagiarismChecker.svg'
import imgSummarozer from '@/assets/icons/summarozer.svg'
import imgTranslator from '@/assets/icons/translator.svg'
import imgCitationGenerator from '@/assets/icons/citationGenerator.svg'
import imgAiDetector from '@/assets/icons/aiDetector.svg'
import imgQuillBotPremium from '@/assets/icons/quillBotPremium.svg'
import imgAppExtensions from '@/assets/icons/appExtensions.svg'

const menuList = [
  {
    id: 0,
    icon: imgParaphraser,
    title: 'Paraphraser',
  },
  {
    id: 1,
    icon: imgGramaarChecker,
    title: 'Grammar Checker',
  },
  {
    id: 2,
    icon: imgQuillBotFlow,
    title: 'QuillBot Flow',
  },
  {
    id: 3,
    icon: imgPlagiarismChecker,
    title: 'Plagiarism Checker',
  },
  {
    id: 4,
    icon: imgAiDetector,
    title: 'AI Detector',
  },
  {
    id: 5,
    icon: imgSummarozer,
    title: 'Summerizer',
  },
  {
    id: 6,
    icon: imgTranslator,
    title: 'Translator',
  },
  {
    id: 7,
    icon: imgCitationGenerator,
    title: 'Citation Generator',
  },
]

const activeItem = ref<number>(1)

function handleActiveItem(id: number) {
  activeItem.value = id
}
</script>

<template>
  <div :class="$style.sidebar">
    <div :class="[$style.sidebarItemBorder, $style.sidebarItemBox]">
      <div v-for="item in menuList" :key="item.id" @click="handleActiveItem(item.id)">
        <div :class="[$style.sidebarItem, activeItem === item.id && $style.sidebarActiveItem]">
          <img :src="item.icon" alt="item">
          <p :class="$style.sidebarItemTitle">
            {{ item.title }}
          </p>
        </div>
      </div>
    </div>
    <div :class="[$style.sidebarItemBorder, $style.sidebarPemiumItem]">
      <div :class="$style.sidebarItem">
        <img
          :src="imgQuillBotPremium" alt=""
          width="24" height="24"
        >
        <p :class="[$style.sidebarItemTitle]">
          QuillBot Premium
        </p>
      </div>
    </div>
    <div :class="$style.sidebarItemBorder">
      <div :class="[$style.sidebarItem, $style.sidebarAppItem]">
        <img
          :src="imgAppExtensions" alt="imgAppExtensions"
          width="20" height="20"
        >
        <p :class="[$style.sidebarItemTitle]">
          Apps & Extensions
        </p>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.sidebar {
    position: fixed;
    top: 52px;
    left: 0px;
    height: 100vh;
    width: fit-content;
    border-right: 1px solid #DEE1E3;
    transition: all 0.3s ease 0.5s;
    overflow: auto;
    padding: 8px;
    width: 96px;
    background-color: #ffff;

    &::-webkit-scrollbar {
        display: none;
    }
}

.sidebarItemBox {
    padding-bottom: 8px;
}

.sidebarItem {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 4px 0;
    border-radius: 8px;
    gap: 4px;
    cursor: pointer;

    img {
        width: 24px;
        height: 24px;
    }

    &.sidebarActiveItem {
        background-color: #E8F3EB;

        &:hover {
            background-color: #E8F3EB;
        }

        &>p {
            font-weight: 600;
        }
    }

    &:hover {
        background-color: #f5f5f5;
    }
}

.sidebarItemIconBox {
    border-radius: 50%;
    overflow: hidden;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-items: center;

    img {
        object-fit: contain;
        margin: auto;
        width: 14px;
        height: 14px;
    }
}

.sidebarItemIcon {
    object-fit: contain;
    margin: auto;
    width: 24px;
    height: 24px;
    margin: 0;
    align-items: center;
}

.sidebarItemTitle {
    font-size: 12px;
    text-align: center;
    line-height: 16px;
    padding: 0 4px;
    letter-spacing: 0.5px;
}

.sidebarItemBorder {
    border-bottom: 1px solid #DEE1E3;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.sidebarItemBoxIcon {
    width: 16px;
    height: 16px;
}

.sidebarItemPremium {
    color: rgb(220, 158, 0);
}

.sidebarGGItem {
    margin-top: 10px;
    position: relative;

    &>.sidebarItemGGIcon {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: #fff;
        position: absolute;
        bottom: 36px;
        right: 25px;
    }
}

.sidebarAppItem {
    margin: 10px 0;
    position: relative;

    &>.sidebarAppMemu {
        position: absolute;
        width: 400px;
        right: 0;
        z-index: 999;
    }
}

.sidebarAppItem {
    display: flex;

}
</style>
