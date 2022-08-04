/**
 * @description 最长回文子串
 */
 var longestPalindrome = function (s) {
  let maxStr = '';
  let maxLen = 0;
  const n = s.length;
  if (s.length < 2) return s;
  let dp = Array.from(new Array(n), () => new Array(n).fill(null))
  for (let j = 1; j < n; j++) {
    for (let i = 0; i <= j; i++) {
      if (i === j) {
        dp[i][j] = true;
      }else if (s[i] !== s[j]) {
        dp[i][j] = false;
      } else {
        if (j - i < 3) {
          dp[i][j] = true;
        } else {
          // 两端值相等，其子串是回文，则其也是回文
          dp[i][j] = dp[i+1][j-1];
        }
      }
      if (dp[i][j] && j-i+1 > maxLen) {
        const tmpStr = s.slice(i, j+1);
        maxStr = tmpStr;
        maxLen = j-i+1;
      }
    }
  }
  if (!maxStr) return s[0];
  return maxStr;
  // return maxStr;
};