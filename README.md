# ME·WORLD — meworld.me

个人博客，纯静态站点（HTML + CSS + 原生 JS，零依赖）。深色杂志风。

- 线上地址：https://meworld.me
- 托管：GitHub Pages（本仓库）
- 域名 DNS：阿里云（4 条 A 记录 → 185.199.108-111.153，www CNAME → 本仓库 Pages 地址）

## 结构

```
index.html        首页
about.html        关于
archive.html      归档
tags.html         标签筛选
404.html          404 页
posts/            文章（新增文章放这里）
css/style.css     全站样式（深色杂志风）
js/site.js        交互：进度条/目录/搜索/返回顶部/复制代码
assets/           favicon 与社交分享封面
search.json       站内搜索索引
feed.xml          RSS
sitemap.xml       站点地图
robots.txt        搜索引擎规则
```

## 新增一篇文章

1. 在 `posts/` 里新建 `xxx.html`（可复制现有文章页改内容，注意改 title / canonical / og / JSON-LD 里的标题与链接）
2. 在 `index.html` 文章列表、`archive.html` 归档、`tags.html`（如适用）里各加一条链接
3. 在 `search.json` 里加一条索引，`feed.xml` 里加一个 item，`sitemap.xml` 里加一个 URL
4. 提交后 GitHub Pages 自动重新发布

## 写作规矩（博客的自我约定）

只写做过的事 · 一篇只解决一个问题 · 完成比完美重要。
