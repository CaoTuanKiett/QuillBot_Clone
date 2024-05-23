import { setContenteditableSelection } from './set'
import { isInput, isTextarea } from './utils'

interface RemoveOptions {
  start: number
  end: number
}

export function removeInputSelection(element: HTMLInputElement, options: RemoveOptions) {
  const el = element as HTMLInputElement

  const value = el.value
  const { start, end } = options

  el.value = value.slice(0, start) + value.slice(end)
}

export function removeTextareaSelection(element: HTMLTextAreaElement, options: RemoveOptions) {
  const el = element as HTMLTextAreaElement

  const value = el.value
  const { start, end } = options

  el.value = value.slice(0, start) + value.slice(end)
}

export function removeContenteditableSelection(element: HTMLElement, options: RemoveOptions) {
  setContenteditableSelection(element, {
    start: options.start,
    end: options.end,
  })

  const selection = window.getSelection()
  const range = selection?.getRangeAt(0)
  range?.deleteContents()
}

export function removeSelection(element: HTMLElement, option: RemoveOptions) {
  if (isInput(element))
    return removeInputSelection(element as HTMLInputElement, option)
  else if (isTextarea(element))
    return removeTextareaSelection(element as HTMLTextAreaElement, option)
  else
    return removeContenteditableSelection(element, option)
}
