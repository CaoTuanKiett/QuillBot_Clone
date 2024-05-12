<script setup lang="ts">
import OpenAi from '@/api/openai'
import iconLoading from '@/assets/icons/loading.svg'
import iconCheck from '@/assets/icons/check.svg'
import iconAI from '@/assets/icons/iconAI.svg'
import iconClose from '@/assets/icons/iconClose.svg'
import iconRefesh from '@/assets/icons/iconRefesh.svg'
import iconDown from '@/assets/icons/iconDown.svg'
import iconApply from '@/assets/icons/iconApply.svg'
import imgLogo from '@/assets/images/logo.png'

const text = ref<string>('')
const result = ref<string>('')
const languageList = [
  'English (US)',
  'French',
  'Spanish',
  'German',
  'All',
]
const activeItem = ref<number>(1)

function handleActiveItem(id: number) {
  activeItem.value = id
}

function pasteText() {
  navigator.clipboard.readText().then((clipText) => {
    text.value = clipText
  })
}

async function parapharseText() {
  try {
    const res = await OpenAi.getParaphraseFullContent(text.value)
    result.value = res
  }
  catch (error) {
    console.error(error)
  }
}

type SelectionSatuts = 'initial' | 'tooltip' | 'popover'

const resultTooltip = ref<string>('')
const boundingRect = ref<{ x: number, y: number }>({ x: 0, y: 0 })
const status = ref<SelectionSatuts>('initial')
let selection: Selection | null = null
const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })
const inputRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)

async function parapharse(text: string) {
  try {
    const res = await OpenAi.getParaphraseFullContent(text)
    console.log('parapharse', res)

    resultTooltip.value = res
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  document.addEventListener('selectionchange', () => {
    selection = window.getSelection()

    if (!selection?.rangeCount || selection?.toString().length === 0)
      return

    const range = selection.getRangeAt(0)

    const rect = range.getBoundingClientRect()

    boundingRect.value = {
      x: rect.right,
      y: rect.top,
    }
  })

  document.addEventListener('mousemove', (e) => {
    mousePosition.value = {
      x: e.clientX,
      y: e.clientY,
    }
  })
})

function handleMouseUp() {
  const selection = window.getSelection()

  if (!selection || selection?.toString().length === 0)
    return

  status.value = 'tooltip'
  console.log('handleMouseUp', selection?.toString())
}

function handleReplace() {
  if (!selection?.rangeCount)
    return

  const range = selection?.getRangeAt(0)
  console.log('range', range)

  range?.deleteContents()
  range?.insertNode(document.createTextNode(resultTooltip.value))
  status.value = 'initial'
  resultTooltip.value = ''
  console.log('selection?', selection)
}

function reselectElement() {
  if (!selection?.anchorNode || !selection?.focusNode || status.value === 'initial')
    return

  const range = document.createRange()

  range.setStart(selection?.anchorNode, selection?.anchorOffset || 0)
  range.setEnd(selection?.focusNode, selection?.focusOffset || 0)

  selection.removeAllRanges()
  selection.addRange(range)
}

function handleBlur() {
  if (inputRef.value && isisMouseInElement(inputRef.value) || tooltipRef.value && isisMouseInElement(tooltipRef.value) || popoverRef.value && isisMouseInElement(popoverRef.value) || status.value === 'popover')
    reselectElement()
}

function handleOpenPopover() {
  if (!selection || selection?.toString().length === 0)
    return
  status.value = 'popover'

  parapharse(selection?.toString())
}

function isisMouseInElement(element: HTMLElement) {
  const elemenRect = element.getBoundingClientRect()
  return (
    mousePosition.value.x >= elemenRect.left
    && mousePosition.value.x <= elemenRect.right
    && mousePosition.value.y >= elemenRect.top
    && mousePosition.value.y <= elemenRect.bottom
  )
}
</script>

<template>
  <div>
    <div
      id="popoverBox"
      :class="$style.popoverBox"
    >
      <div :class="$style.popoverBoxHeader">
        <div :class="$style.popoverBoxHeaderLeft">
          <img :src="iconAI" alt="iconAI">
          <p>S-Group Paraphraser</p>
        </div>
        <img :src="iconClose" alt="iconClose" :class="$style.popoverBoxHeaderRight">
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
          <p>
            <!-- {{ resultTooltip }} -->
            Cats, those mysterious and elegant creatures,
          </p>
        </div>
      </div>
      <div :class="$style.popoverBoxFooter">
        <button :class="$style.popoverBoxFooterCopy">
          Copy
        </button>
        <button :class="$style.popoverBoxFooterApply" @click="handleReplace">
          <img :src="iconApply" alt="iconApply">
          Apply
        </button>
      </div>
    </div>
    <div
      id="mousePosition"
      style="position: fixed; top: 0; right: 0; padding: 10px; background-color: #f1f1f1; z-index: 999;"
    >
      x = {{ mousePosition.x }}
      y = {{ mousePosition.y }}
    </div>
    <img
      v-if="status === 'tooltip'"
      ref="tooltipRef"
      :src="imgLogo"
      :style="{
        position: 'fixed',
        top: `${boundingRect.y}px`,
        left: `${boundingRect.x}px`,
        width: '20px',
        height: '20px',
        zIndex: 999,
        padding: '2px',
        borderRadius: '4px',
        boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
      }"
      @click="handleOpenPopover"
    >
    <div
      v-else-if="status === 'popover'"
      ref="popoverRef"
      :style="{
        position: 'fixed',
        top: `${boundingRect.y}px`,
        left: `${boundingRect.x}px`,
        backgroundColor: 'white',
        minWidth: '20px',
        minHeight: '20px',
        pointerEvents: 'none',
        zIndex: 999,
        padding: '10px',
        borderRadius: '8px',
        boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
      }"
    >
      <div v-if="!resultTooltip" :class="$style.iconBox">
        <img :src="iconLoading" :class="$style.temIcon" alt="iconLoading">
      </div>
      <div
        v-else
        :style="{
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex',
        }"
        @blur="handleBlur"
      >
        <p
          :style="{
            paddingRight: 10,
          }"
        >
          {{ resultTooltip }}
        </p>
        <img :style="{ pointerEvents: 'visible', width: 20 }" :src="iconCheck" alt="iconCheck " @mousedown="handleReplace">
      </div>
    </div>
    <SidebarAuth :class="$style.homeSidebar" />
    <div :class="$style.homeContent">
      <div :class="$style.homeContentParaPhrase">
        <TabRight />
        <ul :class="$style.homeContentLanguageList">
          <li
            v-for="(item, index) in languageList" :key="index"
            :class="activeItem === index && $style.homeLanguageActiveItem" @click="handleActiveItem(index)"
          >
            {{ item }}
          </li>
        </ul>
        <div :class="$style.homeTextFillBox">
          <div :class="$style.homeTextFillBoxHeader">
            <span :class="$style.homeTextFillBoxHeaderTitle">Models:</span>
            <span :class="$style.homeTextFillBoxHeaderValueActive">Standard</span>
            <span :class="$style.homeTextFillBoxHeaderValue">Fluency</span>
            <span :class="$style.homeTextFillBoxHeaderValue">Natural</span>
            <span :class="$style.homeTextFillBoxHeaderValue">Academic</span>
          </div>
          <div :class="$style.homeTextFill">
            <div :class="$style.homeTextFillLeftBox">
              <!-- <textarea
                id="" v-model="text" :class="$style.homeTextFillTag" name="" cols="30" rows="25"
                placeholder="To rewrite text, enter or paste it here and press &quot;Paraphrase.&quot;"
              /> -->
              <div
                id="bounding"
                ref="inputRef"
                contenteditable
                :class="$style.homeTextFillTag"
                :style="{
                  height: '300px',
                  padding: '30px 36px 8px 20px',
                }"
                @mouseup="handleMouseUp"
                @blur="handleBlur"
              />
              <div v-show="!text" :class="$style.homeTextFillBoxPaste" @click="pasteText">
                <div :class="$style.homeTextFillBoxPasteBox">
                  <svg
                    :class="$style.homeTextArerPasteIcon"
                    class="MuiSvgIcon-root MuiSvgIcon-colorPrimary MuiSvgIcon-fontSizeMedium" focusable="false"
                    aria-hidden="true" viewBox="0 0 24 29" width="24" height="29" style="font-size: 30px;"
                  >
                    <path
                      width="24" height="29" viewBox="0 0 24 29" fill="#499557" xmlns="http://www.w3.org/2000/svg"
                      d="M20.7418 3.25678H15.4522C14.9207 1.78883 13.5286 0.72583 11.8835 0.72583C10.2384 0.72583 8.84639 1.78883 8.31489 3.25678H3.02521C1.63319 3.25678 0.494263 4.3957 0.494263 5.78772V26.0353C0.494263 27.4273 1.63319 28.5662 3.02521 28.5662H20.7418C22.1339 28.5662 23.2728 27.4273 23.2728 26.0353V5.78772C23.2728 4.3957 22.1339 3.25678 20.7418 3.25678ZM11.8835 3.25678C12.5795 3.25678 13.149 3.82624 13.149 4.52225C13.149 5.21826 12.5795 5.78772 11.8835 5.78772C11.1875 5.78772 10.618 5.21826 10.618 4.52225C10.618 3.82624 11.1875 3.25678 11.8835 3.25678ZM20.7418 26.0353H3.02521V5.78772H5.55615V9.58414H18.2109V5.78772H20.7418V26.0353Z"
                    />
                  </svg>
                  <i>Paste Text</i>
                </div>
              </div>
              <div :class="$style.homeTextFillLeftFooter">
                <div :class="$style.homeTextFillLeftUpload">
                  <Icon :class="$style.homeIcon" icon="bi:cloud-arrow-up" />
                  <span>Upload Doc</span>
                </div>
                <button
                  :class="$style.homeTextFillLeftButton"
                  @click="parapharseText"
                >
                  Paraphrase
                </button>
              </div>
            </div>
            <div :class="$style.homeTextFillRightBox">
              <textarea
                id="" v-model="result" :class="$style.homeTextFillTag" disable name="" cols="30" rows="25"
                placeholder="To rewrite text, enter or paste it here and press &quot;Paraphrase.&quot;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.iconBox {
  width: 24px;
  height: 24px;
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f3f3f3;
    border-radius: 50%;
  }
}

.temIcon {
  object-fit: contain;
  margin: auto;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.box {
  margin-left: 100px;
}

.homeContent {
  margin-left: 96px;
  margin-top: 52px;
  background-color: #f1f1f1;
  // height: 100vh;

  &::-webkit-scrollbar {
    width: 3px;
  }
}

.homeContentParaPhrase {
  position: relative;
  padding: 25px 100px 44px 40px;
  height: 100vh;
}

.homeContentLanguageList {
  display: flex;
  align-items: center;

  li {
    padding: 8px 16px;
    font-size: 14px;
    color: #505050;
    border-radius: 8px 8px 0px 0px;
    cursor: pointer;

    &.homeLanguageActiveItem {
      z-index: 1;
      background-color: #ffff;

      &:hover {
        background-color: #ffffff9e;
      }
    }

    &:hover {
      background-color: #25252514;
    }
  }
}

.homeTextFillBox {
  position: relative;
  box-shadow: rgba(0, 0, 0, 0.3) 0px 26px 38px, rgba(0, 0, 0, 0.22) 0px 24px 12px;
}

.homeTextFillBoxHeader {
  position: sticky;
  top: 49px;
  z-index: 10;
  line-height: 1.5;
  height: 50px;
  display: flex;
  align-items: center;
  background-color: #ffff;
  border-bottom: 1px solid #DEE1E3;
}

.homeTextFillBoxHeaderTitle {
  color: #505050;
  padding: 13px 12px 12px 20px;
  font-weight: 700;
  font-size: 16px;
}

.homeTextFillBoxHeaderValueActive {
  color: #499557;
  font-weight: 500;
  padding: 14px 9px 11px 9px;
  border-bottom: 2px solid #499557;
}

.homeTextFillBoxHeaderValue {
  color: black;
  font-weight: 500;
  padding: 14px 9px 11px 9px;
}

.homeTextFill {
  background-color: #ffff;
  display: flex;
  align-items: start;
}

.homeTextFillLeftBox {
  position: relative;
  width: 50%;
  border-right: 3px solid rgba(0, 0, 0, 0.2);
}

.homeTextFillRightBox {
  width: 50%;
}

.homeTextFillTag {
    resize: none;
    width: 100%;
    border: none;
    padding: 30px 36px 8px 20px;

    &::placeholder {
      font-size: 16px;
      color: #8B8B8B;
      font-weight: 300;
    }

    &:focus {
      outline: none;
    }
}

.homeTextFillLeftFooter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 12px;
}

.homeTextFillLeftUpload {
  display: flex;
  align-items: center;
  gap: 4px;
  background-color: #ffff;
  margin-right: 10px;
  height: 54px;
  padding-left: 15px;

  span {
    font-weight: 600;
    font-size: 12px;
    line-height: 16px;
    color: #252525;
  }
}

.homeIcon {
  width: 24px;
  height: 24px;
}

.homeTextFillLeftButton {
  padding: 5px 25px 6px;
  font-size: 17.5px;
  font-weight: bold;
  width: 140px;
  min-height: 40px;
  background-color: #499557;
  color: #ffff;
  border: none;
  border-radius: 25px;
  cursor: pointer;
}

.homeGetPremium {
  background-color: #ffff;
  padding: 80px 0;
  text-align: center;
}

.homeGetPremiumContent {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.homeGetPremiumDescription {
  font-size: 32px;
  font-weight: 400;
  line-height: 44px;
  color: #172b4d;
  max-width: 66.67%;
  padding-bottom: 32px;
}

.homeGetPremiumBtnBox {
  display: flex;
  justify-content: center;
  width: 100%;
  padding-bottom: 16px;
}

.homeGetPremiumBtn {
  border: none;
  display: flex;
  align-items: center;
  border-radius: 32px;
  padding: 8px 20px;
  background-color: #008847;

  &>span {
    font-size: 16px;
    color: #ffff;
  }
}

.homeGetPremiumCountDate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;

  &>span {
    font-weight: 600;
    line-height: 24px;
    color: #172b4d;
  }
}

.homeTextFillBoxPaste {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  position: absolute;
  top: 40%;
  margin-bottom: 20px;
  gap: 12px;
  transform: translateX(-50%);
  left: 50%;
  border: 1px solid #499557;
  border-radius: 6px;
}

.homeTextFillBoxPasteBox {
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  padding: 10px;
  width: 130px;
  height: 74px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  i {
    color: #499557;
  }
}

.homeTextArerPasteIcon {
  color: #499557;
  width: 24px;
}

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
