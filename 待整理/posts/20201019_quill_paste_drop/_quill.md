```js
import { message } from 'antd'

import { STSUpload } from '@sxc/upload-toolkit'
import store from '@/store'

const dispatch = store.dispatch

export class ImageDrop {
  constructor(quill, options = {}) {
    this.quill = quill
    this.quill.root.addEventListener('drop', this.handleDrop, false)
    this.quill.root.addEventListener('paste', this.handlePaste, true)
  }

  handleDrop = async evt => {
    evt.preventDefault()
    if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
      const files = Array.from(evt.dataTransfer.files)
      if (
        files.some(file => !file.type.match(/^image\/(gif|jpe?g|a?png|bmp|vnd\.microsoft\.icon)/i))
      ) {
        // 非图片不得拖拽
        message.warn('靓仔，只支持图片拖拽哦 ^_^')
        return
      }
      try {
        dispatch({ type: 'iteration/updateState', payload: { richEditorLoading: true } })
        // const reqData = await getData()
        const list = await Promise.all(Array.from(files, file => STSUpload({ file })))
        const idx = (this.quill.getSelection() || {}).index || this.quill.getLength()
        list.forEach(url => this.quill.insertEmbed(idx, 'image', url))
        this.quill.setSelection(idx + list.length)
      } catch (err) {
        console.log('拖拽图片错误:', err)
      } finally {
        dispatch({ type: 'iteration/updateState', payload: { richEditorLoading: false } })
      }
    }
  }

  handlePaste = async evt => {
    evt.preventDefault()
    if (evt.clipboardData && evt.clipboardData.items && evt.clipboardData.items.length) {
      const items = Array.from(evt.clipboardData.items)
      const idx = (this.quill.getSelection() || {}).index || this.quill.getLength()
      if (
        items.every(file => file.type.match(/^image\/(gif|jpe?g|a?png|bmp|vnd\.microsoft\.icon)/i))
      ) {
        try {
          dispatch({ type: 'iteration/updateState', payload: { richEditorLoading: true } })
          const list = await Promise.all(
            Array.from(items, file => STSUpload({ file: file.getAsFile() }))
          )
          const idx = (this.quill.getSelection() || {}).index || this.quill.getLength()
          this.quill.insertEmbed(idx, 'image', list[0])
          this.quill.setSelection(idx + 1)
        } catch (err) {
          console.log('粘贴图片错误:', err)
        } finally {
          dispatch({ type: 'iteration/updateState', payload: { richEditorLoading: false } })
        }
      } else {
        try {
          items[0].getAsString(text => {
            this.quill.insertText(idx, text)
            this.quill.setSelection(idx + text.length)
          })
        } catch (err) {
          console.log('粘贴文字错误:', err)
        }
      }
    }
  }
}

```
