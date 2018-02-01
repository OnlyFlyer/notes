# git 常用命令


多成员一起做项目时, 使用 `git` 仓库托管代码会极大的提高开发效率, 因此需要对 `git` 进行一系列的操作, 现在有很多的图形化工具, 如 `SouceTree`, `SmartGit` .. 但是个人还是推荐学会 `git` 的命令行, 在任何情况下, 命令行都和图形化工具一样好用, 而且更有 `逼格`, 下面是个人在工作中总结的一些 `git` 命令, 如下:


  `将项目从git上clone下来:`

  ```JavaScript

  git clone SSH address

  ```

  `一般clone下来的都是master分支, 在项目开发过程中需要创建自己的分支, 以防止由于个人的原因污染master分支上的代码, 一般是从master分支上或者项目的大分支上再切出一个分支进行开发`

  ```JavaScript

    git branch test

    // 查看本地分支
    git branch

    // 查看所有分支, 包括云端上面的分支
    git branch -r

  ```

  `在本地分支上面互相切换`

  ```JavaScript
  
  git checkout xxx
  
  ```

  `将工作区的代码传至云端 三步走`

  ```JavaScript
  
  // 第一步, 将代码添加到本地服务器
  git add .

  // 第二步, 添加提交代码的解释
  git commit -m 'xxx'

  // 第三步, 上传至云端
  git push origin test
  
  ```

  `查看分支提交的日志信息`

  ```JavaScript

    git log

    // 有几个可加的参数, 有时候也很好用, 介绍一下

    // 具体精确到每一次提交的每一行代码, 在查看微小的代码改动时很方便
    git log --cc

    // 具体到每次提交改动的文件, 比--cc稍微粗略一点
    git log --stat

    // 仅显示每次提交日志的一行, 在大致看看提交情况的时候很方便
    git log --oneline

  ```

  `拉取云端的代码`

  ```JavaScript
  
  git pull

  git fetch

  // git pull 和 git fetch 是分开的, 都可拉取云端代码, 网上有说 pull = fetch + merge 的 , 我的理解是 git pull 会将拉取下来的代码与本地的代码再进行一次 merge, 但是 fetch 不会
  
  ```

  `合并代码`

  ```JavaScript
  
  // 将本地的 test 分支上的代码与现所在分支合并冲突, 有些时候会出现冲突的代码, 这时候就要去判断留谁的 或者 都留下
  git merge test
  
  ```

  `删除本地分支`

  ```JavaScript
  // 删除本地 test 分支, 但是不能够删除现在所在的分支
  git branch -D test
  
  ```

  `删除云端分支`

  ```JavaScript

    // 慎用
    git push origin :test

    // 网上还有一种命令方式
    git push --delete test
  
  ```