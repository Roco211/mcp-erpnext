# AI ERP 只读连通基线

## 目的

本文件记录 `ai-erp-platform` 本地开发环境中，`mcp-erpnext` 连接 ERPNext
的最小只读方式。

本阶段只允许读取安全级对象，不允许写 ERPNext 业务单据。

## 本地 ERPNext

```text
URL: http://127.0.0.1:8080
Site: frontend
```

## 本地只读用户

```text
mcp.readonly@example.local
```

API key/API secret 只能保存在本地环境变量或本地密钥管理中，不允许提交到仓库。

当前权限目标：

```text
Company read=true
Company write=false
Company create=false
Company delete=false
```

## 工具过滤

本阶段只开放一个工具：

```text
erpnext_company_list
```

启动时设置：

```powershell
$env:ERPNEXT_URL = "http://127.0.0.1:8080"
$env:ERPNEXT_API_KEY = "<本地只读用户 API key>"
$env:ERPNEXT_API_SECRET = "<本地只读用户 API secret>"
$env:ERPNEXT_MCP_TOOL_ALLOWLIST = "erpnext_company_list"
$env:ERPNEXT_MCP_READ_ONLY_ONLY = "1"
```

启动 HTTP 模式：

```powershell
npx -y deno run --allow-all server.ts --http --port=3013 --hostname=127.0.0.1
```

期望日志：

```text
[mcp-erpnext] Initialized — 1 tools
[mcp-erpnext] HTTP server listening on http://127.0.0.1:3013
```

## 验证

```powershell
npx -y deno test --allow-all src/client_test.ts
npx -y deno test --allow-all src/
```

期望：

```text
client_test.ts: 7 passed
src/: 153 passed
0 failed
```

工具调用期望：

```text
MCP_ALLOWED_TOOLS erpnext_company_list:readOnly=true
MCP_COMPANY_LIST doctype=Company count=1
```

## 边界

- 不接 AI Gateway。
- 不做多租户。
- 不开放写工具。
- 不提交 API key/API secret。
- 不读取真实客户数据。
