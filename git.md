# 版本控制系统

版本控制是一种记录一个或多个文件内容变化, 以便于将来查阅特定版本修订情况的系统.

对于工程师来说, 采用版本控制系统是一个好的方式, 有了它就可以将某个文件回溯到之前的状态, 甚至将整个项目都回退到过去某个时间点的状态. 从版本控制系统出现到现在, 大致分为三种系统:

1. **本地版本控制系统**

![](./img/local.png)

`本地版本控制系统` : 工作原理是在硬盘上保存补丁集(指文件修订前后的变化), 通过应用所有的补丁, 可以重新计算出各个版本的文件内容

2. **集中化的版本控制系统**

![](./img/centralized.png)

`集中化的版本控制系统` : 本地版本控制系统的问题就是只能在本地的计算机上进行操作, 不同系统的开发者就不能够协同工作了, 所以集中化的版本控制系统应运而生. 这类的系统都有一个单一的集中管理的服务器, 保存所有文件的修订版本, 而协同人员通过客户端连接到服务器, 去除最新的文件或者提交更新.

3. **分布式版本控制系统**

![](./img/distributed.png)

`分布式版本控制系统` : 集中化的版本控制系统带来了很多好处, 每个人都可以在一定成都上看到项目中其他人正在做什么, 而管理员也可以轻松掌控每个开发者的权限. 不过它也有缺点, 如果中央服务器 `crash` 了, 那么谁都无法提交更新, 也无法协同工作, 而且如果中心数据库所在的磁盘发生损坏, 有没有做恰当备份, 那么你将丢失所有的数据--包括项目的整个变更历史, 只剩在各自机器上保留的单独快照. 于是分布式版本控制系统出现了, 在这类系统中, 客户端不只是提取最新版本的文件快照, 二十八代码仓库完整的镜像下来, 这样依赖, 任何一处协同工作的服务器发生故障s, 事后都可以用任何一个镜像出来的本地仓库恢复, 因为每一次的克隆操作, 实际上都是一次对代码仓库的完整备份


# Git

#### Git 的特点
  1. 近乎所有操作都是本地执行

> Git 不需要连到服务器去获取历史, 它只需要直接从本地数据库中读取, 即使离线也能够轻松的查到历史提交

  2. Git 保证完整性

> Git 中所有数据在存储前都会计算校验和, 然后以校验和来引用, 这个功能构在 Git 底层, 若你在传送过程中丢失信息或损坏文件, Git 就能发现

  3. Git 只添加数据

> Git几乎只往 Git 数据库中增加数据, 很难让 Git 执行任何不可逆操作, 或者让它清除数据. 未提交更新时有可能丢失或弄乱修改的内容, 但是一旦你提交快照到 Git 中, 就难以丢失数据了.

  4. Git 三种状态

    - - 已提交(committed)
    - - 已修改(modified)
    - - 已暂存(staged)





# git 常用命令


多成员一起做项目时, 使用 `git` 仓库托管代码会极大的提高开发效率, 因此需要对 `git` 进行一系列的操作, 现在有很多的图形化工具, 如 `SouceTree`, `SmartGit` .. 但是个人还是推荐学会 `git` 的命令行, 在任何情况下, 命令行都和图形化工具一样好用, 而且更有 `逼格`, 下面是个人在工作中总结的一些 `git` 命令, 如下:

  当安装完 Git 应该做的第一件事就是设置 `用户名称`和 `邮件地址` , 因为每一个 Git 提交都会使用这些信息, 并且它会写入到你的每一次提交中, 不可更改.

  ```JavaScript

    git config --global user.name 'xx'

    git config --global user.email 'xx@yy.com'
  
  ```

  之后可以配置一下默认的文本编辑器, 当 Git 需要你输入信息时会调用它. 若未配置则会使用默认的文本编辑器, 通常是 Vim

  ```JavaScript

    git config --global core.editor xx
 
  ```

  想要检查配置 可以用 `git config --list` 来列出所有 Git 能够找到的配置

  ```JavaScript
    $ git config --list
    credential.helper=osxkeychain
    user.name=wutao
    user.email=wutao@smartx.com
    github.user=username
  
  ```

  `将项目从git上clone下来:`

  ```JavaScript

  git clone xxx

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

`列出/创建标签`

```JavaScript

  // 列出标签
  git tag

  // 创建标签
  git tag -a 'v1.0' -m 'this is v1.0'

```


  `可以跳过使用暂存区域的方式`

  ```JavaScript
    // 就是 git add 和 git commit 的综合
    git commit -a -m 'xxx'
  
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

  `更改文件`

  ```JavaScript
    // 将 aa 文件 更名为 bb
    git mv aa bb

    // 下面三条命令与上面一条功能上一致
    mv aa bb
    git rm aa
    git add bb

  ```

  `移除文件`

  ```JavaScript
    -- 待添加
  
  ```

  `合并代码`

  ```JavaScript
  
  // 将本地的 test 分支上的代码与现所在分支合并冲突, 有些时候会出现冲突的代码, 这时候就要去判断留谁的 或者 都留下
  // 慎用
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

  `取消暂存文件`

  ```JavaScript
    git reset HEAD xx.xx

    // or

    git reset xx.xx
  
  ```

  `撤销修改`

  ```JavaScript

    git checkout -- xx.xx
  
  ```


`Git 别名`

```JavaScript

  // git co === git checkout
  git config --global alias.co checkout

  // git br === git branch
  git config --global alias.br branch

  // git st === git status
  git config --global alias.st status

  // git ci === git commit
  git config --global alias.ci commit


  // git unstage fileA === git reset HEAD -- fileA
  git config --global alias.unstage 'HEAD --'

  // git last = git log -1 HEAD
  git config --global alias.last 'log -1 HEAD'

```

# 学习 Git 中的问题和答案

1. `HEAD` 和 `origin` 的具体意思

> `HEAD` 是一个特殊的指针, 指向当前所在的本地分支(将 `HEAD` 想象为当前分支的别名)

> `origin` 是运行 `git clone` 时默认的远程仓库名字 **错误的, 暂时不理解**