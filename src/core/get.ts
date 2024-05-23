// <div contenteditable>Hello <b>World</b>  </div>
// Hello <b>World</b>
// start: 3
// end: 9
// direction: forward
// text: llo <b>Wor</b>

import { isInput, isTextarea } from './utils'

interface GetSelectionResult {
  start: number
  end: number
  direction: 'forward' | 'backward' | 'none'
  text: string
}

export function getInputSelection(element: HTMLInputElement) {
  const el = element as HTMLInputElement

  const result = {
    start: el.selectionStart,
    end: el.selectionEnd,
    direction: el.selectionDirection,
    text: el.value.slice(el.selectionStart || 0, el.selectionEnd || 0),
  }

  return result as GetSelectionResult
}

export function getTextareaSelection(element: HTMLTextAreaElement) {
  const el = element as HTMLTextAreaElement

  const result = {
    start: el.selectionStart,
    end: el.selectionEnd,
    direction: el.selectionDirection,
    text: el.value.slice(el.selectionStart || 0, el.selectionEnd || 0),
  }

  return result as GetSelectionResult
}

export function getSelectionCharacterOffsetWithin(element: HTMLElement) {
  let start = 0
  let end = 0

  const selection = window.getSelection()

  if (!selection || selection.rangeCount === 0)
    return { start, end }

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()

  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.startContainer, range.startOffset)

  start = preCaretRange.toString().length

  preCaretRange.setEnd(range.endContainer, range.endOffset)
  end = preCaretRange.toString().length

  return { start, end }
}

export function getDefaultSelection(_element: HTMLElement) {
  return {
    start: 0,
    end: 0,
    direction: 'none' as const,
    text: '',
  }
}

export function getContenteditableSelection(element: HTMLElement) {
  const selection = window.getSelection()

  if (!selection?.rangeCount)
    return getDefaultSelection(element)

  const range = selection.getRangeAt(0)

  const { start, end } = getSelectionCharacterOffsetWithin(range.commonAncestorContainer as HTMLElement)

  const cloneSelection = range!.cloneContents()

  const div = document.createElement('div')
  div.appendChild(cloneSelection)

  return {
    start,
    end,
    direction: 'forward' as const,
    text: div.innerHTML || range?.toString() || div.textContent || '',
  }
}

export function getSelection(element: HTMLElement) {
  if (isInput(element))
    return getInputSelection(element)
  else if (isTextarea(element))
    return getTextareaSelection(element)
  else
    return getContenteditableSelection(element)
}
