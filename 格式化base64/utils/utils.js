/**
 * base64转成Blob对象
 * @param {string} dataurl base64字符串
 */
export const dataURLtoBlob = (dataurl) => {
    dataurl = dataurl.startsWith('data:image/png;base64,') ? dataurl.split(',')[1] : dataurl
    // 正则匹配删除换行符，避免在 IOS9 以下的机器出现兼容问题
    const base64Str = dataurl.replace(/\r\n/g, '')
    var bstr = atob(base64Str)
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: 'image/png' })
  }
  /**
   * Blob转File
   * @param {Blob} theBlob Blob对象
   * @param {string} fileName 文件名称
   */
  export const blobToFile = (theBlob, fileName = 'file.png') => {
    return new File([theBlob], fileName, {
      type: 'image/png',
      lastModified: Date.now()
    })
  }
  /**
   * 将base64转换为文件
   * @param {*} dataurl
   * @param {*} filename
   */
  export const dataURLtoFile = (dataurl, filename = 'file') => {
    var arr = dataurl.split(',')
    var mime = arr[0].match(/:(.*?);/)[1]
    let suffix = mime.split('/')[1]
    var bstr = atob(arr[1])
    var n = bstr.length
    var u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new File([u8arr], `${filename}.${suffix}`, { type: mime })
  }