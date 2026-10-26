# 失语者的世界 · 夜巡版 v0.2.0

## 发布到 GitHub Pages

1. 解压本包，将全部文件及 vendor 文件夹上传到你选定的 GitHub 仓库根目录。index.html 必须位于根目录。不要只上传 ZIP 文件，也不要把 index.html 额外套进 dist 文件夹。
2. 在仓库 Settings → Pages 中，选择 Deploy from a branch，并选择实际使用的分支（通常是 main）及 / (root)。保存。账号与仓库类型必须支持 GitHub Pages。
3. 等待 Pages 显示发布成功，使用它返回的访问地址。
4. 用未登录的浏览器和另一台设备测试：主页显示 v0.2.0 夜巡版、可以开始新游戏、可以移动并调查物件。

这是静态网页游戏，无需API Key、数据库或服务器端程序。所有资源在包内。保留 .nojekyll 文件。

WASD移动，拖动环顾，E调查，J笔记，Esc暂停。全程支持文字线索与静音游玩。
存档保存在当前浏览器，不跨设备或域名同步。
测试攻略（有剧透）在 test-guide.html；盲测时不要把攻略链接发给玩家。

更换托管可以避开原 chatgpt.site 域名，但不能保证所有地区与网络都可达，需要实测。
Three.js许可证：vendor/THREE-LICENSE.txt。
