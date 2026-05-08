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

专用角色：

```text
AI ERP MCP Read Only
```

当前权限目标：

```text
Company read=true
Company write=false
Company create=false
Company delete=false
Item read=true
Item write=false
Item create=false
Item delete=false
Warehouse read=true
Warehouse write=false
Warehouse create=false
Warehouse delete=false
Item Group read=true
Item Group write=false
Item Group create=false
Item Group delete=false
UOM read=true
UOM write=false
UOM create=false
UOM delete=false
Brand read=true
Brand write=false
Brand create=false
Brand delete=false
Account read=false
Customer read=false
Supplier read=false
```

## 工具过滤

本阶段默认开放六个工具：

```text
erpnext_company_list
erpnext_item_list
erpnext_warehouse_list
erpnext_item_group_list
erpnext_uom_list
erpnext_brand_list
```

在 `ai-erp-platform` 工作区中，优先使用控制仓库脚本启动：

```powershell
cd C:\Users\roco2\Documents\Codex\2026-05-08\vibe-coding\ai-erp-platform\control-plane
.\scripts\start-mcp-readonly.ps1
```

脚本会自动设置：

```powershell
$env:ERPNEXT_URL = "http://127.0.0.1:8080"
$env:ERPNEXT_MCP_TOOL_ALLOWLIST = "erpnext_company_list,erpnext_item_list,erpnext_warehouse_list,erpnext_item_group_list,erpnext_uom_list,erpnext_brand_list"
$env:ERPNEXT_MCP_READ_ONLY_ONLY = "1"
```

手动启动 HTTP 模式：

```powershell
npx -y deno run --allow-all server.ts --http --port=3013 --hostname=127.0.0.1
```

期望日志：

```text
[mcp-erpnext] Initialized — 6 tools
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
src/: 156 passed
0 failed
```

工具调用期望：

```text
erpnext_company_list: Company count=1
erpnext_item_list: Item count=1
erpnext_warehouse_list: Warehouse count=1
erpnext_item_group_list: Item Group count>=0
erpnext_uom_list: UOM count>=0
erpnext_brand_list: Brand count>=0
```

控制仓库冒烟脚本：

```powershell
cd C:\Users\roco2\Documents\Codex\2026-05-08\vibe-coding\ai-erp-platform\control-plane
.\scripts\test-mcp-readonly-smoke.ps1
```

冒烟路径会检查 ERPNext ping、六个安全 DocType REST 读取、
Account/Customer/Supplier REST 拒绝、MCP 工具白名单、只读标记和工具调用。

## 边界

- 不接 AI Gateway。
- 不做多租户。
- 不开放写工具。
- 默认不开放 Account、Customer、Supplier。
- 不提交 API key/API secret。
- 不读取真实客户数据。
