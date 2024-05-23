import { setContenteditableSelection } from './set'
import { isInput, isTextarea } from './utils'

interface ReplaceOptions {
  start: number
  end: number
  text: string
}

export function replaceInputSelection(element: HTMLInputElement, options: ReplaceOptions) {
  const el = element as HTMLInputElement

  const value = el.value
  const { start, end, text } = options

  el.value = value.slice(0, start) + text + value.slice(end)
}

export function replaceTextareaSelection(element: HTMLTextAreaElement, options: ReplaceOptions) {
  const el = element as HTMLTextAreaElement

  const value = el.value
  const { start, end, text } = options

  el.value = value.slice(0, start) + text + value.slice(end)
}

export function replaceContenteditableSelection(element: HTMLElement, options: ReplaceOptions) {
  setContenteditableSelection(element, {
    start: options.start,
    end: options.end,
  })

  const selection = window.getSelection()
  const range = selection.getRangeAt(0)
  range?.deleteContents()
  range?.insertNode(document.createTextNode(options.text))
}

export function replaceSelection(element: HTMLElement, option: ReplaceOptions) {
  if (isInput(element))
    return replaceInputSelection(element as HTMLInputElement, option)
  else if (isTextarea(element))
    return replaceTextareaSelection(element as HTMLTextAreaElement, option)
  else
    return replaceContenteditableSelection(element, option)
}
