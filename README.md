# 部署说明 (Deployment Guide)

## 安全部署方案

本项目使用安全的API Key管理方案，确保敏感信息不会被暴露到GitHub仓库。

### 🔒 安全特性

- **API Key不暴露**：使用Next.js API Route保护敏感的API Key
- **环境变量安全**：`.env.local`文件被`.gitignore`忽略
- **服务器端处理**：所有API调用在服务器端完成，用户无法获取API Key
- **用户认证**：集成了Supabase提供的安全Google登录认证功能
- **支付安全**：使用Creem进行支付处理，支付信息不经过我们的服务器

### � Google登录功能

本应用集成了Google OAuth登录功能，使用Supabase作为身份验证服务。

- **安全的Google OAuth认证**：用户可以使用Google账户安全登录
- **会话管理**：使用服务器端会话管理，确保用户状态安全
- **隐私保护**：不存储敏感的用户密码，所有认证由Google和Supabase处理
- **强制重新认证**：每次登录时都会重定向到Google认证页面，确保用户确认

要配置Google登录功能，请按以下步骤操作：

1. 访问 [Supabase控制台](https://app.supabase.com/)
2. 创建项目或使用现有项目
3. 进入Authentication > Providers > Google
4. 启用Google认证并获取所需的凭据
5. 将这些凭据添加到您的环境变量中

### 💳 Creem支付功能

本应用集成了Creem支付系统，提供安全便捷的支付体验。

- **安全的支付处理**：所有支付信息直接在用户浏览器与Creem服务器之间传输
- **多种支付方式**：支持信用卡、PayPal等多种支付方式
- **订阅管理**：支持订阅和一次性付费两种模式
- **自动续费**：订阅服务自动续费，确保服务不中断

要配置Creem支付功能，请按以下步骤操作：

1. 访问 [Creem.io](https://creem.io/)
2. 注册账户并创建产品
3. 获取API Key和Webhook Secret
4. 将这些凭据添加到您的环境变量中

### 部署前准备

1. **获取API Key**
   - 访问 [OpenRouter.ai](https://openrouter.ai/)
   - 注册账户并获取API Key
   - API格式：`sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

2. **环境配置**
   ```bash
   # 在项目根目录创建 .env.local 文件
   OPENROUTER_API_KEY=your_actual_api_key_here
   CREEM_API_KEY=your_creem_api_key_here
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### 🚀 部署选项

#### 选项1: Vercel部署 (推荐)

1. **Fork本项目到GitHub**
   ```bash
   git clone https://github.com/zhengym9666/nanobanano-clone.git
   cd nanobanano-clone
   ```

2. **配置环境变量**
   - 在Vercel控制台中设置环境变量：
     - 变量名：`OPENROUTER_API_KEY`
     - 值：你的API Key

3. **部署**
   ```bash
   npm install
   npm run build
   vercel deploy
   ```

#### 选项2: 自定义服务器部署

1. **克隆代码**
   ```bash
   git clone https://github.com/zhengym9666/nanobanano-clone.git
   cd nanobanano-clone
   ```

2. **配置环境变量**
   ```bash
   # 创建 .env.local 文件
   echo "OPENROUTER_API_KEY=your_actual_api_key_here" > .env.local
   ```

3. **安装依赖并部署**
   ```bash
   npm install
   npm run build
   npm start
   ```

### 🔧 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 复制环境变量模板
cp .env.example .env.local

# 3. **编辑 .env.local，添加你的API Key
OPENROUTER_API_KEY=your_actual_api_key_here

# 4. 配置Google登录功能
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# 5. 配置Creem支付功能
CREEM_API_KEY=your_creem_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# 6. 启动开发服务器
npm run dev
```

### ⚠️ 重要提醒

- **不要提交API Key到Git**：`.env.local`已被添加到`.gitignore`
- **保护环境变量**：在生产环境中务必设置正确的环境变量
- **API限制**：注意OpenRouter的API使用限制和费用

### 🛠️ 故障排除

1. **API调用失败**
   - 检查API Key是否正确
   - 确认网络连接正常
   - 查看服务器日志

2. **构建失败**
   - 确认Node.js版本兼容
   - 清理缓存：`rm -rf .next node_modules`
   - 重新安装：`npm install`

3. **环境变量未生效**
   - 重启开发服务器
   - 确认变量名正确：`OPENROUTER_API_KEY`

4. **Google登录失败**
   - 检查Supabase环境变量配置
   - 确认Supabase项目已正确配置Google OAuth
   - 清除浏览器缓存和Cookie
   - 查看浏览器控制台中的错误信息

### 📚 相关文档

- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Vercel环境变量配置](https://vercel.com/docs/concepts/projects/environment-variables)
- [OpenRouter API文档](https://openrouter.ai/docs)

---

**安全第一**：始终确保API Key等敏感信息不会暴露给客户端！