<template>
  <div class="plsql-plantuml-page q-pa-md">
    <div class="text-h4 q-mb-lg">PL/SQL转PlantUML流程图</div>
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">存储过程代码输入</div>
        <q-input v-model="plsqlCode" type="textarea" :rows="10" outlined placeholder="请输入Oracle存储过程代码..." />
        <div class="q-mt-md">
          <q-btn color="primary" label="生成流程图代码" @click="generatePlantUml" :disable="!plsqlCode" />
        </div>
      </q-card-section>
    </q-card>
    <q-card v-if="plantUmlCode" class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">PlantUML流程图代码</div>
        <q-input v-model="plantUmlCode" type="textarea" :rows="10" readonly />
        <div class="q-mt-md">
          <q-btn color="secondary" label="复制" @click="copyResult" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const plsqlCode = ref('')
const plantUmlCode = ref('')

const generatePlantUml = () => {
  const code = plsqlCode.value
  const lines = code.split(/\r?\n/)
  let result = ['@startuml', 'start']
  let inLoop = false
  let pendingComment = ''
  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (!line) continue
    // 单行注释
    if (/^--/.test(line)) {
      pendingComment += line.replace(/^--\s*/, '') + ' ';
      continue
    }
    // 多行注释（简单处理，遇到/*...*/）
    if (/^\/\*/.test(line)) {
      pendingComment += line.replace(/^\/\*|\*\/$/g, '').trim() + ' ';
      continue
    }
    // FOR LOOP
    if (/for\s+\w+\s+in\s+.*loop/i.test(line)) {
      if (pendingComment) {
        result.push(`:${pendingComment.trim()};`)
        pendingComment = ''
      }
      result.push(':打开游标;')
      result.push('repeat')
      result.push('  :从游标取一行;')
      inLoop = true
      continue
    }
    // SQL操作
    if (/insert\s+into|update\s+|delete\s+from|select\s+/i.test(line)) {
      if (pendingComment) {
        result.push(`:${pendingComment.trim()};`)
        pendingComment = ''
      }
      result.push(`  :${line.replace(/;$/, '')};`)
      continue
    }
    // IF/ELSE
    if (/^if\s+.*then$/i.test(line)) {
      if (pendingComment) {
        result.push(`:${pendingComment.trim()};`)
        pendingComment = ''
      }
      result.push(`if (${line.replace(/^if\s*|then$/gi, '').trim()}) then (是)`)
      continue
    }
    if (/^else$/i.test(line)) {
      result.push('else (否)')
      continue
    }
    if (/^end if;?$/i.test(line)) {
      result.push('endif')
      continue
    }
    // COMMIT/ROLLBACK
    if (/commit|rollback/i.test(line)) {
      if (inLoop) {
        result.push('repeat while (CUR 还有数据?)')
        inLoop = false
      }
      if (pendingComment) {
        result.push(`:${pendingComment.trim()};`)
        pendingComment = ''
      }
      result.push(`:${line.replace(/;$/, '').toUpperCase()};`)
      continue
    }
    // 其他语句
    if (pendingComment) {
      result.push(`:${pendingComment.trim()};`)
      pendingComment = ''
    }
    result.push(`:${line.replace(/;$/, '')};`)
  }
  if (inLoop) {
    result.push('repeat while (CUR 还有数据?)')
  }
  result.push('end')
  result.push('@enduml')
  plantUmlCode.value = result.join('\n')
}

const copyResult = () => {
  if (!plantUmlCode.value) return
  navigator.clipboard.writeText(plantUmlCode.value)
  $q.notify({ type: 'positive', message: '已复制到剪贴板' })
}
</script>

<style scoped>
.plsql-plantuml-page {
  max-width: 800px;
  margin: 0 auto;
}
</style>