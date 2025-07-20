<template>
  <div class="sql-format-page q-pa-md">
    <q-card class="tool-card">
      <q-card-section>
        <div class="text-h6 q-mb-md">{{ localLan.title }}</div>
        <q-input
          v-model="rawSql"
          type="textarea"
          :rows="8"
          :label="localLan.inputLabel"
          outlined
          dense
          class="q-mb-md"
        />
        <q-select
          v-model="selectedDialect"
          :options="dialectOptions"
          :label="localLan.dialectLabel"
          outlined
          dense
          class="q-mb-md"
        />
        <q-btn color="primary" :label="localLan.formatBtn" @click="formatSql" class="q-mb-md" />
        <q-btn color="secondary" :label="localLan.clearBtn" @click="clearAll" flat class="q-mb-md q-ml-sm" />
        <div v-if="formattedSql" class="q-mt-md">
          <div class="text-subtitle2 q-mb-xs">{{ localLan.resultTitle }}</div>
          <pre class="result-content">{{ formattedSql }}</pre>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { sqlFormat_cn, sqlFormat_jp } from './SqlFormat_lan'

const { locale, t } = useI18n()

// 语言包本地合并
const localLan = computed(() => {
  if (locale.value === 'jp') return sqlFormat_jp
  return sqlFormat_cn
})

let sqlFormatter: any

const rawSql = ref('')
const formattedSql = ref('')

const dialectOptions = [
  { label: 'Standard SQL', value: 'sql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MariaDB', value: 'mariadb' },
  { label: 'SQLite', value: 'sqlite' },
  { label: 'Oracle PL/SQL', value: 'plsql' },
  { label: 'Transact-SQL', value: 'tsql' }
]
const selectedDialect = ref('sql')

const preprocessSql = (sql: string) => {
  // 替换 MyBatis 占位符为普通字符串
  return sql.replace(/#\{[^}]+\}/g, "'占位符'").replace(/\$\{[^}]+\}/g, "'占位符'");
}

const autoSpaceKeywords = (sql: string) => {
  // 在常见SQL关键字前后补空格，避免关键字和表名/字段名粘连
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'ORDER BY',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE'
  ];
  let result = sql;
  keywords.forEach(kw => {
    // 前后都补空格，防止粘连
    const reg = new RegExp(`([^\s])(${kw})([^\s])`, 'gi');
    result = result.replace(reg, '$1 $2 $3');
    // 前补空格
    result = result.replace(new RegExp(`([^\s])(${kw})\\b`, 'gi'), '$1 $2');
    // 后补空格
    result = result.replace(new RegExp(`\\b(${kw})([^\s])`, 'gi'), '$1 $2');
  });
  return result;
}

const formatSql = async () => {
  if (!sqlFormatter) {
    sqlFormatter = (await import('sql-formatter')).format
  }
  try {
    const preSql = autoSpaceKeywords(preprocessSql(rawSql.value))
    formattedSql.value = sqlFormatter(preSql, { language: selectedDialect.value })
  } catch (e: any) {
    // 自动降级尝试 Standard SQL
    if (selectedDialect.value !== 'sql') {
      try {
        const preSql = autoSpaceKeywords(preprocessSql(rawSql.value))
        formattedSql.value = sqlFormatter(preSql, { language: 'sql' })
        formattedSql.value = localLan.value.autoSwitch + '\n' + formattedSql.value
        return
      } catch {}
    }
    formattedSql.value = localLan.value.formatFail + '\n' + (e?.message || '') + '\n' + localLan.value.formatFailTip
  }
}

const clearAll = () => {
  rawSql.value = ''
  formattedSql.value = ''
}
</script>

<style scoped>
.sql-format-page {
  min-height: 100vh;
  background: var(--q-grey-1);
}
.result-content {
  background: #f4f4f4;
  border-radius: 4px;
  padding: 12px;
  font-size: 14px;
  white-space: pre-wrap;
  word-break: break-all;
  user-select: text;
  cursor: text;
}
</style>
