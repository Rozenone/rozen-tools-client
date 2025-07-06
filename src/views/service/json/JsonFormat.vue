<!-- json格式化 -->
<template>
  <div>
    <h5>
      {{ $t('jsonFormat.tips') }}
    </h5>
    <q-input
      v-model="inputText"
      color="orange"
      class="input_area"
      filled
      type="textarea"
    />
    <q-btn class="json_btn" color="primary" :label="$t('jsonFormat.format')" @click="format()" />
    <q-btn class="json_btn" color="primary" :label="$t('jsonFormat.compress')" @click="compressJson()" />
    <div id="tip">{{ tip }}</div>
    <div class="output_box" v-html="outputText" contenteditable="true">
    </div>
  </div>
</template>

<script setup lang='ts'>
import { getCurrentInstance, ref } from 'vue'

const { proxy } = getCurrentInstance() as any
const inputText = ref('')
const outputText = ref('')
const tip = ref('')

// 格式化json
const format = () => {
  try {
    const jsonObject = JSON.parse(inputText.value)
    inputText.value = JSON.stringify(jsonObject, null, 2)
    const highlightedJSON = JSON.stringify(jsonObject, null, 2)
      .replace(/"([^"]+)"/g, '<span class="string"  >"$1"</span>') // 高亮字符串值
      .replace(/(\b\d+\b)/g, '<span class="number">$1</span>') // 高亮数字值
      .replace(/\b(true|false)\b/g, '<span class="boolean">$1</span>') // 高亮布尔值
      .replace(/\b(null)\b/g, '<span class="null">$1</span>') // 高亮 null
    outputText.value = `<pre>${highlightedJSON}</pre>`
    tip.value = proxy.$t('jsonFormat.checkPass')
  } catch (error: any) {
    tip.value = error.message
  }
}

// 压缩json
const compressJson = () => {
  try {
    const parsedData = JSON.parse(inputText.value)
    inputText.value = JSON.stringify(parsedData)
    tip.value = proxy.$t('jsonFormat.checkPass')
    outputText.value = ''
    tip.value = proxy.$t('jsonFormat.compressSuccess')
  } catch (error: any) {
    tip.value = error.message
  }
}


</script>


<style scoped>
* {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.json_btn {
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

.string {
  color: #008000;
}

.number {
  color: #0000FF;
}

.boolean {
  color: #d14;
}

.null {
  color: #d14;
}

.body--dark .string {
  color: #7fff7f;
}
.body--dark .number {
  color: #6ab0ff;
}
.body--dark .boolean, .body--dark .null {
  color: #ffb86c;
}
</style>