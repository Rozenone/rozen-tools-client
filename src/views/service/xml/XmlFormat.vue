<!-- XML格式化 -->
<template>
  <div>
    <h5>
      {{ $t('xmlFormat.tips') }}
    </h5>
    <q-input v-model="inputText" color="orange" class="input_area" filled type="textarea" />
    <q-btn class="xml_btn" color="primary" :label="$t('xmlFormat.format')" @click="format()" />
    <q-btn class="xml_btn" color="primary" :label="$t('xmlFormat.compress')" @click="compress()" />
    <q-btn class="xml_btn" color="secondary" :label="$t('xmlFormat.copy')" @click="copyResult()" />
    <q-btn class="xml_btn" color="negative" :label="$t('xmlFormat.clear')" @click="clear()" />
    <div id="tip">{{ tip }}</div>
    <div class="output_box" v-html="outputText" contenteditable="true">
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from 'vue'

const { proxy } = getCurrentInstance() as unknown as { proxy: { $t: (key: string) => string } }
const inputText = ref('')
const outputText = ref('')
const tip = ref('')

// 格式化XML
const format = () => {
  try {
    const xml = inputText.value.trim()
    if (!xml) {
      tip.value = proxy.$t('xmlFormat.emptyInput')
      return
    }

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')

    // 检查解析错误
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error(proxy.$t('xmlFormat.parseError'))
    }

    const formatted = formatXmlNode(xmlDoc.documentElement, 0)
    const highlighted = highlightXml(formatted)
    outputText.value = `<pre>${highlighted}</pre>`
    tip.value = proxy.$t('xmlFormat.checkPass')
  } catch (error: unknown) {
    tip.value = (error instanceof Error ? error.message : String(error)) || proxy.$t('xmlFormat.parseError')
  }
}

// 压缩XML
const compress = () => {
  try {
    const xml = inputText.value.trim()
    if (!xml) {
      tip.value = proxy.$t('xmlFormat.emptyInput')
      return
    }

    const parser = new DOMParser()
    const xmlDoc = parser.parseFromString(xml, 'text/xml')

    // 检查解析错误
    const parserError = xmlDoc.querySelector('parsererror')
    if (parserError) {
      throw new Error(proxy.$t('xmlFormat.parseError'))
    }

    const compressed = compressXmlNode(xmlDoc.documentElement)
    inputText.value = compressed
    outputText.value = ''
    tip.value = proxy.$t('xmlFormat.compressSuccess')
  } catch (error: unknown) {
    tip.value = (error instanceof Error ? error.message : String(error)) || proxy.$t('xmlFormat.parseError')
  }
}

// 递归格式化XML节点
const formatXmlNode = (node: Node, indent: number): string => {
  const indentStr = '  '.repeat(indent)
  let result = ''

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    const tagName = element.tagName

    // 开始标签
    result += `${indentStr}<${tagName}`

    // 属性
    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      result += ` ${attr.name}="${escapeXml(attr.value)}"`
    }

    if (element.childNodes.length === 0) {
      // 空元素
      result += ' />\n'
    } else {
      result += '>'

      // 检查是否只有文本子节点
      const hasOnlyText = element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE

      if (hasOnlyText) {
        const textContent = element.textContent || ''
        result += escapeXml(textContent)
        result += `</${tagName}>\n`
      } else {
        result += '\n'
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i]
          if (child.nodeType === Node.ELEMENT_NODE) {
            result += formatXmlNode(child, indent + 1)
          } else if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent?.trim()
            if (text) {
              result += '  '.repeat(indent + 1) + escapeXml(text) + '\n'
            }
          }
        }
        result += `${indentStr}</${tagName}>\n`
      }
    }
  }

  return result
}

// 递归压缩XML节点
const compressXmlNode = (node: Node): string => {
  let result = ''

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as Element
    const tagName = element.tagName

    result += `<${tagName}`

    for (let i = 0; i < element.attributes.length; i++) {
      const attr = element.attributes[i]
      result += ` ${attr.name}="${escapeXml(attr.value)}"`
    }

    if (element.childNodes.length === 0) {
      result += '/>'
    } else {
      result += '>'
      for (let i = 0; i < element.childNodes.length; i++) {
        const child = element.childNodes[i]
        if (child.nodeType === Node.ELEMENT_NODE) {
          result += compressXmlNode(child)
        } else if (child.nodeType === Node.TEXT_NODE) {
          result += escapeXml(child.textContent || '')
        }
      }
      result += `</${tagName}>`
    }
  }

  return result
}

// XML转义
const escapeXml = (str: string): string => {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

// 高亮XML
const highlightXml = (xml: string): string => {
  return xml
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/(&lt;\/?)([\w:]+)/g, '$1<span class="xml-tag">$2</span>')
    .replace(/([\w:]+)=&quot;([^&]*)&quot;/g, '<span class="xml-attr">$1</span>=<span class="xml-string">&quot;$2&quot;</span>')
}

// 复制结果到剪贴板
const copyResult = () => {
  const textToCopy = outputText.value.replace(/<[^>]*>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  if (!textToCopy) {
    tip.value = proxy.$t('xmlFormat.nothingToCopy')
    return
  }

  navigator.clipboard.writeText(textToCopy).then(() => {
    tip.value = proxy.$t('xmlFormat.copySuccess')
  }).catch(() => {
    tip.value = proxy.$t('xmlFormat.copyFailed')
  })
}

// 清空
const clear = () => {
  inputText.value = ''
  outputText.value = ''
  tip.value = ''
}
</script>

<style scoped>
* {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.xml_btn {
  margin: .3em .5em;
}

.output_box {
  background: #f4f4f4;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #222;
  min-height: 80px;
  margin-top: 1em;
}

.body--dark .output_box {
  background: #23272e !important;
  color: #e0e0e0 !important;
}
</style>

<style>
#tip {
  color: red;
}

.xml-tag {
  color: #22863a;
}

.xml-attr {
  color: #6f42c1;
}

.xml-string {
  color: #032f62;
}

.body--dark .xml-tag {
  color: #7ee787;
}

.body--dark .xml-attr {
  color: #d2a8ff;
}

.body--dark .xml-string {
  color: #a5d6ff;
}
</style>
