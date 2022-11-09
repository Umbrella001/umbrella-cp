import { Message } from 'element-ui'

const DirectiveCopy = {
  bind(el, { value, modifiers }) {
    // 用一个全局属性来存传进来的值，因为这个值在别的钩子函数里还会用到
    el.$value = value ? value : modifiers.text && el.textContent
    el.handler = () => {
      if (!el.$value) {
        Message.warning('无复制内容')
        return
      }
      try {
        return navigator.clipboard
          .writeText(text)
          .then(() => {
            Message.success('复制成功')
          })
          .catch(err => {
            Message.warning('复制失败')
            console.error('复制失败：', err)
          })
      } catch (e) {
        // 使用textarea支持换行符
        const textarea = document.createElement('textarea')
        textarea.readOnly = 'readonly'
        textarea.style.position = 'fixed'
        textarea.style.left = '-9999px'
        textarea.style.zIndex = '-999'
        document.body.appendChild(textarea)
        textarea.value = el.$value
        textarea.focus()
        textarea.select()
        try {
          const result = document.execCommand('copy')
          document.body.removeChild(textarea)
          if (!result || result === 'unsuccessful') {
            Message.warning('复制失败')
          } else {
            Message.success('复制成功')
          }
        } catch (e) {
          document.body.removeChild(textarea)
          Message.warning(
            '当前浏览器不支持复制功能，请检查更新或更换其他浏览器操作'
          )
        }
      }
    }
    // 绑定点击事件
    el.addEventListener('click', el.handler)
  },
  // 当传进来的值更新的时候触发
  componentUpdated(el, { value, modifiers }) {
    el.$value = value ? value : modifiers.text && el.textContent
  },
  // 指令与元素解绑的时候，移除事件绑定
  unbind(el) {
    el.removeEventListener('click', el.handler)
  }
}

export default DirectiveCopy
