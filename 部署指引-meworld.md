# ME·WORLD 个人博客 — 部署到自有域名 meworld.me 指引

> 本包为纯静态站点（HTML/CSS，无依赖），GitHub Pages 和 Vercel 均可直接部署。
> 全程浏览器操作，不需要装任何工具（方案一）；想用命令行可用方案二。

---

## 方案一：GitHub Pages（推荐，全程浏览器操作）

### 第 1 步：建仓库
1. 注册/登录 [github.com](https://github.com)。
2. 右上角 **+** → **New repository**。
3. 仓库名填 **`你的用户名.github.io`**（例如用户名是 xiao，就填 `xiao.github.io`）——这样博客自动挂在 `https://你的用户名.github.io`，顺便就有了个免费二级域名；用普通仓库名（如 `meworld-blog`）也可以，只是默认地址多个路径。
4. 选 **Public**，勾选 **Add a README**，点 **Create repository**。

### 第 2 步：上传源码
1. 仓库页面点 **Add file → Upload files**。
2. 把本包里 **所有文件**（index.html、about.html、CNAME、.nojekyll、css/ 整个文件夹、posts/ 整个文件夹）拖进去上传。
3. 点 **Commit changes**。注意：上传界面要进入对应目录操作（css、posts 文件夹内文件需进入文件夹再传），或用方案二的命令行一次推完。

### 第 3 步：开启 Pages
1. 仓库 → **Settings → Pages**。
2. Source 选 **Deploy from a branch**，分支选 **main**，目录选 **/(root)**，Save。
3. 等 1–2 分钟，回到该页面看到 `Your site is live at https://你的用户名.github.io`。

### 第 4 步：绑定 meworld.me（DNS 配置，在你买域名的平台操作）
在域名管理后台（阿里云/腾讯云/Namecheap/GoDaddy 等的 DNS 解析设置）添加：

| 记录类型 | 主机记录 | 记录值 |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | 你的用户名.github.io |

> 包内已含 `CNAME` 文件（内容为 meworld.me），GitHub Pages 会自动识别。

### 第 5 步：回到 GitHub 验证域名
1. Settings → Pages → **Custom domain** 填 `meworld.me`，Save。
2. 等 DNS 生效（几分钟到几小时），页面出现绿勾后，勾选 **Enforce HTTPS**。
3. 浏览器访问 **https://meworld.me** ✅（www.meworld.me 也会自动跳转）

---

## 方案二：Vercel（全球 CDN，速度通常更好）

1. [vercel.com](https://vercel.com) 注册（可直接用 GitHub 账号登录）。
2. 先按方案一第 1、2 步把代码推到 GitHub（Vercel 从 GitHub 拉取）。
3. Vercel 控制台 → **Add New… → Project** → Import 你的博客仓库 → 框架选 **Other** → **Deploy**。
4. 项目 → **Settings → Domains** → 添加 `meworld.me` 和 `www.meworld.me`，按页面提示在域名平台加 DNS：
   - A 记录：`@` → `76.76.21.21`
   - CNAME：`www` → `cname.vercel-dns.com`
5. 等 DNS 验证通过，HTTPS 自动签发，访问 https://meworld.me ✅

> 若已按方案一配置了 DNS，切换到 Vercel 时需删掉 GitHub 那几条 A 记录再按上面改。

---

## 国内访问提示（如实说明）

GitHub Pages 与 Vercel 的服务器都在境外，国内直连**能访问但速度可能一般、偶有波动**（Vercel 绑定自定义域名后一般比 GitHub Pages 稳定）。如果之后觉得慢，可选：
- 把域名 DNS 托管到 **Cloudflare**（免费 CDN 加速 + 隐藏源站），再加一层缓存；
- 或改用国内静态托管（需域名备案）。

---

## 更新文章怎么办

- 改完 HTML 后：GitHub 网页端重新 Upload files / 或命令行 `git add . && git commit -m "更新" && git push`，1 分钟内自动重新发布。
- 以后想让我（WorkBuddy）代写新文章：把文章 HTML 发我放进 posts/ 并在 index.html 列表加一行即可，我可以直接帮你改好。

## 文件清单

| 文件 | 说明 |
|---|---|
| index.html | 首页（文章列表） |
| about.html | 关于页 |
| posts/*.html | 3 篇文章（示例内容，可替换） |
| css/style.css | 全站样式 |
| CNAME | 自定义域名声明（GitHub Pages 用） |
| .nojekyll | 跳过 Jekyll 处理，部署更快 |
