// <div contenteditable>Hello <b>World</b>  </div>
// Hello <b>World</b>
// start: 3
// end: 9
// direction: forward
// text: llo <b>Wor</b>

import { isInput, isTextarea } from './utils'

interface SetSelectionOptions {
  start: number
  end: number
  direction?: 'forward' | 'backward' | 'none'
}

export function setInputSelection(element: HTMLInputElement, options: SetSelectionOptions) {
  const el = element as HTMLInputElement

  el.setSelectionRange(options.start, options.end, options.direction || 'forward')
}

export function setTextareaSelection(element: HTMLTextAreaElement, options: SetSelectionOptions) {
  const el = element as HTMLTextAreaElement

  el.setSelectionRange(options.start, options.end, options.direction || 'forward')
}

export function setContenteditableSelection(element: HTMLElement, options: SetSelectionOptions) {
  const selection = window.getSelection()
  const range = document.createRange()

  const startNode = element.childNodes[0]
  const endNode = element.childNodes[element.childNodes.length - 1]

  if (!startNode || !endNode)
    return

  range.setStart(startNode, options.start)
  range.setEnd(endNode, options.end)

  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function setNativeSelection() { }

// export function setSelection(element: HTMLElement) {
//   if (isInput(element))
//     return setInputSelection(element as HTMLInputElement, options: SetSelectionOptions)
//   else if (isTextarea(element))
//     return setTextareaSelection(element as HTMLTextAreaElement, options)
//   else
//     return setContenteditableSelection(element, options)
// }
