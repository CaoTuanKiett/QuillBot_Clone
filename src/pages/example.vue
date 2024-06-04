<script setup lang="ts">
import { computePosition, flip, inline, offset, shift } from '@floating-ui/dom'
import { getSelection } from '../core/get'
// import { setSelection } from '../core/set'
import OpenAi from '@/api/openai'
import iconLoading from '@/assets/icons/loading.svg'
import iconAI from '@/assets/icons/iconAI.svg'
import iconClose from '@/assets/icons/iconClose.svg'
import iconRefesh from '@/assets/icons/iconRefesh.svg'
import iconDown from '@/assets/icons/iconDown.svg'
import iconApply from '@/assets/icons/iconApply.svg'
import iconPaste from '@/assets/icons/paste.svg'
import imgLogo from '@/assets/images/logo.png'

const text = ref<string>('')
const result = ref<string>('')
const resultRef = ref<HTMLElement | null>(null)
const languageList = ['English (US)', 'French', 'Spanish', 'German', 'All']
const activeItem = ref<number>(1)
const resultTooltip = ref<string>('')
const status = ref<'initial' | 'tooltip' | 'popover'>('initial')
const mousePosition = ref<{ x: number, y: number }>({ x: 0, y: 0 })
const inputRef = ref<HTMLElement | null>(null)
const tooltipRef = ref<HTMLElement | null>(null)
const popoverRef = ref<HTMLElement | null>(null)
const rect = ref(new DOMRect())
const childRects = ref<DOMRect[]>([])
let selection: any | null = null

const virtualElement = ref({
  getBoundingClientRect: () => rect.value,
  getClientRects: () => [childRects.value[childRects.value.length - 1]],
})

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
    result.value = await OpenAi.getParaphraseFullContent(text.value)
  }
  catch (error) {
    console.error(error)
  }
}

async function attachTooltip() {
  if (tooltipRef.value) {
    const { x, y, strategy } = await computePosition(virtualElement.value, tooltipRef.value, {
      strategy: 'fixed',
      placement: 'right-end',
      middleware: [flip(), shift(), offset(4), inline()],
    })

    Object.assign(tooltipRef.value.style, { position: strategy, left: `${x}px`, top: `${y}px` })
  }
}

async function attachPopover() {
  if (popoverRef.value) {
    const { x, y, strategy } = await computePosition(virtualElement.value, popoverRef.value, {
      strategy: 'fixed',
      placement: 'top',
      middleware: [flip(), shift(), offset(4), inline()],
    })

    Object.assign(popoverRef.value.style, { position: strategy, left: `${x}px`, top: `${y}px` })
  }
}

async function parapharse(text: string) {
  try {
    resultTooltip.value = await OpenAi.getParaphraseFullContent(text)
  }
  catch (error) {
    console.error(error)
  }
}

onMounted(() => {
  document.addEventListener('selectionchange', () => {
    if (resultRef.value) {
      selection = getSelection(resultRef.value)

      if (selection?.text) {
        status.value = 'tooltip'
        nextTick(attachTooltip)
        console.log('selection', selection.text)
      }
      else { status.value = 'initial' }
    }

    // if (selection?.rangeCount && selection.toString().length > 0) {
    // //   const range = selection.getRangeAt(0)
    // //   rect.value = range.getBoundingClientRect()
    // //   childRects.value = Array.from(range.getClientRects())
    // }
  })

  document.addEventListener('mousemove', (e) => {
    mousePosition.value = { x: e.clientX, y: e.clientY }
  })
})

function handleMouseUp() {
  selection = window.getSelection()
  if (selection && selection?.toString().length > 0) {
    status.value = 'tooltip'
    nextTick(attachTooltip)
  }
}

function handleReplace() {
  if (selection?.rangeCount) {
    const range = selection.getRangeAt(0)
    range.deleteContents()
    range.insertNode(document.createTextNode(resultTooltip.value))
    status.value = 'initial'
    resultTooltip.value = ''
  }
}

function reselectElement() {
  if (!selection?.anchorNode || !selection?.focusNode || status.value === 'initial') {
    selection?.removeAllRanges()
    return
  }

  const range = document.createRange()
  range.setStart(selection.anchorNode, selection.anchorOffset || 0)
  range.setEnd(selection.focusNode, selection.focusOffset || 0)
  selection.removeAllRanges()
  selection.addRange(range)
}

function handleBlur() {
  if (isElementHovered(inputRef.value) || isElementHovered(tooltipRef.value) || isElementHovered(popoverRef.value) || status.value === 'popover')
    reselectElement()
}

function handleOpenPopover() {
  if (selection && selection?.toString().length > 0) {
    status.value = 'popover'
    nextTick(attachPopover)
    parapharse(selection.toString())
  }
}

function isElementHovered(element: HTMLElement | null) {
  if (!element)
    return false
  const { left, right, top, bottom } = element.getBoundingClientRect()
  const { x, y } = mousePosition.value
  return x >= left && x <= right && y >= top && y <= bottom
}

function handleClosePopover() {
  status.value = 'initial'
  resultTooltip.value = ''
}

function handleInput(event: any) {
  text.value = event.target.textContent
}

// function handleInputResult(event: any) {
//   result.value = event.target.textContent
// }
</script>

<template>
  <div>
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
        width: '20px',
        height: '20px',
        zIndex: 999,
        padding: '2px',
        borderRadius: '4px',
        boxShadow: 'rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset',
      }"
      @click="handleOpenPopover"
    >
    <!-- popover -->
    <div
      v-else-if="status === 'popover'"
      id="popoverBox"
      ref="popoverRef"
      :class="$style.popoverBox"
      :style="{
      }"
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
        <button :class="$style.popoverBoxFooterApply" @click="handleReplace">
          <img :src="iconApply" alt="iconApply">
          Apply
        </button>
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
                @mouseup="handleMouseUp"
                @blur="handleBlur"
                @input="handleInput"
              />
              <div v-show="!text" :class="$style.homeTextFillBoxPaste" @click="pasteText">
                <div :class="$style.homeTextFillBoxPasteBox">
                  <img :src="iconPaste" alt="iconPaste">
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
                id=""
                ref="resultRef" v-model="result" :class="$style.homeTextFillTag" disable name="" cols="30" rows="25"
                placeholder="To rewrite text, enter or paste it here and press &quot;Paraphrase.&quot;"
              />
              <!-- <div
                contenteditable
                :class="$style.homeTextFillTag"
                placeholder="To rewrite text, enter or paste it here and press &quot;Paraphrase.&quot;"
                @input="handleInputResult"
                @mouseup="handleMouseUp"
                @blur="handleBlur"
                v-text="result"
              /> -->
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
    height: 468px;
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
  width: 100px;
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

//box popover
.popoverBox {
  position: fixed;
  // top: 100px;
  // left: 100px;
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
  height: 120px;
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
