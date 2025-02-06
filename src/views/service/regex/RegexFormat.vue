<!-- 正则表达式 -->
<template>
  <div>
    <div class="input_box">
      <q-input class="input_main" v-model="regex"
               :label="$t('regexFormat.tip.inputReg')"
               @input="updateHighlightedText"
               prefix="/">
        <template v-slot:append>
          <q-avatar>
            {{ '/' + suffix }}
          </q-avatar>
        </template>
      </q-input>
      <!--      选择框-->
      <q-select
        filled
        v-model="model"
        :options="options"
        :label="$t('regexFormat.tip.modifier')"
        multiple
        emit-value
        map-options
        class="selection"
      >
        <template v-slot:option="{ itemProps, opt, selected, toggleOption }">
          <q-item v-bind="itemProps">
            <q-item-section>
              <q-item-label v-html="opt.label" />
            </q-item-section>
            <q-item-section side>
              <q-toggle :model-value="selected" @update:model-value="toggleOption(opt)" />
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>
    <!--    输入文本域-->
    <q-input
      v-model="inputText"
      filled
      @input="updateHighlightedText"
      type="textarea"
      style="margin-bottom: 10px"
    />
    <!--    输出文本域-->
    <!-- 高亮显示匹配结果 -->
    <h5>{{ $t('regexFormat.tip.matchText') }}</h5>
    <pre v-html="highlightedText" class="match_text"></pre>
  </div>
</template>

<script setup lang='ts'>
import { getCurrentInstance, ref, watch } from 'vue'

const { proxy } = getCurrentInstance()
const regex = ref('')
const suffix = ref('g')
const model = ref([])
const fixedOrder = ['g', 'i', 'm', 's'] // 固定顺序
const options = [
  {
    label: proxy.$t('regexFormat.tip.global'),
    value: 'g',
  },
  {
    label: proxy.$t('regexFormat.tip.ignoreCase'),
    value: 'i',
  },
  {
    label: proxy.$t('regexFormat.tip.MultiLine'),
    value: 'm',
  },
  {
    label: proxy.$t('regexFormat.tip.lineBreaks'),
    value: 's',
  },
]
const inputText = ref('')
const highlightedText = ref('')

const updateHighlightedText = () => {
  try {
    // 如果用户输入正则表达式
    const regexText = new RegExp(regex.value, suffix.value) // 使用全局匹配
    // 对示例文本进行匹配
    // 将匹配后的文本显示在pre标签中
    highlightedText.value = inputText.value.replace(regexText, match => {
      // 将匹配的部分包裹上span标签，添加高亮样式
      return `<span style="background-color: yellow;">${match}</span>`
    })
  } catch (e) {
    // 如果正则无效，清空高亮文本
    highlightedText.value = proxy.$t('regexFormat.tip.regexErrMessage')
  }
}

// 监听用户输入
watch(inputText, () => {
  updateHighlightedText()
})
watch(regex, () => {
  updateHighlightedText()
})
watch(suffix, () => {
  updateHighlightedText()
})

// 监听下拉选项
watch(model, async (newVal) => {
  suffix.value = fixedOrder
    .filter(value => newVal.includes(value))
    .join('')
})

</script>


<style scoped>
* {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

.input_box {
  display: flex;
  justify-content: space-between;
}

.input_main {
  margin: 0 3px;
  width: 77%;
}

.selection {
  width: 23%;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

pre {
  white-space: pre-wrap; /* 自动换行 */
  word-wrap: break-word; /* 防止单词溢出 */
}

span {
  color: red; /* 高亮部分的字体颜色 */
  font-weight: bold;
}

.match_text {
  background-color: #f1f1f1;
}
</style>