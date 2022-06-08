## git hook 尝试+总结

> 本文源于在公司一次提交代码的过程中，将自己的私人邮箱作为 `git config user.email` 提交到远端，导致在计算代码量、千行 BUG 率等一些指标过程中对数据造成影响


```bash

$: git config user.name "***"
$: git config user.email "***@**.**"

```

```bash

$: git config --global user.name "***"
$: git config --global user.email "***@**.**"

```


`commit-msg` `hook` 方式

```bash

# 验证 git user【用户名/邮箱】
repository_name=$(git config user.name)
readonly repository_name
repository_email=$(git config user.email)
readonly repository_email
current_commitMsg=`cat $1`
readonly current_commitMsg

msg_regex="^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?: .{1,100}"
email_regex="^[a-zA-Z0-9._%+-]+@cai\-inc.com$"

# user.name | user.email is empty
if [ -z "$repository_email" ] || [ -z "$repository_name" ]; then
	# user.email is empty
	echo "ERROR: [pre-commit hook] Aborting commit because user.email or user.name is missing, Please check your git config."
	exit 1
# user.email is not zcy email
elif [[ ! $repository_email =~ $email_regex ]]; then
	echo "ERROR: [pre-commit hook] Aborting commit because $repository_email is not ZCY email, Please check your git config."
	exit 1
# commit msg valid
elif [[ ! $current_commitMsg =~ $msg_regex  ]]; then
	echo "ERROR: [pre-commit hook] Aborting commit because $current_commitMsg is not a good commit msg, Please check your commit msg."
	exit 1
fi

```

