# 踩坑

## 设置 contributes.configuration 下的多 checkbox 需要设置 additionalProperties

没有 additionalProperties 的对象设置
对象设置必须将 additionalProperties 设置为 false ，以便在设置编辑器中支持对象。否则，设置编辑器会解读为复杂设置（不规律的设置），并将用户定向到设置 JSON 文件。
