<script setup lang="ts">
import iconLoading from '@/assets/icons/loading.svg'
import iconAI from '@/assets/icons/iconAI.svg'
import iconClose from '@/assets/icons/iconClose.svg'
import iconRefesh from '@/assets/icons/iconRefesh.svg'
import iconDown from '@/assets/icons/iconDown.svg'
import iconApply from '@/assets/icons/iconApply.svg'

defineProps({
  resultTooltip: {
    type: String,
    required: true,
  },
  // status: {
  //   type: String,
  //   required: true,
  // },
  popoverRef: {
    type: [String, HTMLElement, null],
    required: true,
  },
  handleBlur: {
    type: Function,
    required: true,
  },
  handleReplace: {
    type: Function,
    required: true,
  },
})
</script>

<template>
  <div
    id="popoverBox"
    :ref="popoverRef"
    :class="$style.popoverBox"
  >
    <div :class="$style.popoverBoxHeader">
      <div :class="$style.popoverBoxHeaderLeft">
        <img :src="iconAI" alt="iconAI">
        <p>S-Group Paraphraser</p>
      </div>
      <img :src="iconClose" alt="iconClose" :class="$style.popoverBoxHeaderRight" @click="handleClosePopover">
    </div>
    <div :class="$style.popoverBoxContainer">
      <div :class="$style.popoverBoxContainerHeader">
        <div :class="$style.popoverBoxContainerHeaderLeft">
          <img :src="iconRefesh" alt="iconRefesh">
          <p>Refresh</p>
        </div>
        <div :class="$style.popoverBoxContainerHeaderRight">
          <img :class="$style.popoverBoxIconDownLeft" :src="iconDown" alt="iconDown">
          <p>1/1</p>
          <img :class="$style.popoverBoxIconDownRight" :src="iconDown" alt="iconDown">
        </div>
      </div>
      <div :class="$style.popoverBoxContainerBody">
        <img v-if="!resultTooltip" :src="iconLoading" :class="$style.temIcon" alt="iconLoading">
        <p v-else>
          {{ resultTooltip }}
          <!-- Cats, those mysterious and elegant creatures, -->
        </p>
      </div>
    </div>
    <div :class="$style.popoverBoxFooter">
      <button :class="$style.popoverBoxFooterCopy">
        Copy
      </button>
      <button :class="$style.popoverBoxFooterApply" @click="handleReplace()">
        <img :src="iconApply" alt="iconApply">
        Apply
      </button>
    </div>
  </div>
</template>

<style module lang="scss">
.popoverBox {
  position: fixed;
  top: 100px;
  left: 100px;
  width: 480px;
  max-height: 278px;
  background-color: white;
  padding: 12px;
  z-index: 998;
  border-radius: 8px;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 19px 38px, rgba(0, 0, 0, 0.22) 4px 0px 15px 12px;
}

.popoverBoxHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 4px;
}

.popoverBoxHeaderLeft {
  display: flex;
  align-items: center;

  img {
    width: 28px;
    margin-right: 8px;
  }

  p {
    font-size: 16px;
    font-weight: 600;
    color: #555;
  }
}

.popoverBoxHeaderRight {
  cursor: pointer;
}

.popoverBoxContainer {
  padding: 20px;
}

.popoverBoxContainerHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  img {
    width: 24px;
  }
}

.popoverBoxIconDownRight {
  transform: rotate(180deg);
}

.popoverBoxContainerHeaderLeft {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 24px;
  }

  p {
    font-size: 14px;
    font-weight: 600;
    color: #A9A9A9;
  }
}

.popoverBoxContainerHeaderRight {
  display: flex;
  align-items: center;

  img {
    width: 24px;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  p {
    font-size: 14px;
    font-weight: 600;
    color: #A9A9A9;
  }
}

.popoverBoxContainerBody {
  width: 424px;
  max-height: 120px;
  overflow-y: auto;
  background-color: #f1f1f1;
  padding: 12px;
  border-radius: 8px;

  p {
    font-size: 16px;
    color: #555;
    text-align: justify;
  }
}

.popoverBoxFooter {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-bottom: 16px;
}

.popoverBoxFooterApply {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 95px;
  height: 36px;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  background-color: #4643DD;
  color: white;
  border-radius: 26px;
  cursor: pointer;
  border: none;

  &:hover {
    opacity: 0.8;
  }

  img {
    width: 22px;
  }
}

.popoverBoxFooterCopy {
  width: 66px;
  height: 36px;
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  background-color: white;
  border-radius: 26px;
  border: solid 1px #DADCE0;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
}
</style>
