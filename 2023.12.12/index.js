// 给你一个链表，删除链表的倒数第 n 个结点，并且返回链表的头结点。

// 示例 1：
// 输入：head = [1,2,3,4,5], n = 2
// 输出：[1,2,3,5]

// 示例 2：
// 输入：head = [1], n = 1
// 输出：[]

// 示例 3：
// 输入：head = [1,2], n = 1
// 输出：[1]

// 链表定义：
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} n
 * @return {ListNode}
 */
var removeNthFromEnd = function(head, n) {
  let slow = head, fast = head;
  while (n > 0) {
    fast = fast.next;
    n--;
  }
  // console.log(slow, '--34');
  // console.log(fast, '--35');
  // return;
  while(fast) {
    fast = fast.next;
    if (fast) {
      slow = slow.next;
    }
  };
  slow.next = slow.next.next;
  return head;


  // let len = 0;
  // let tmp = head;
  // while(tmp) {
  //   tmp = tmp.next;
  //   len++;
  // };
  // let p = 1;
  // let curr = head;
  // while(p < len - n) {
  //   curr = curr.next;
  //   p++;
  // };
  // curr.next = curr.next.next;
  // return head;
};

function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

const arr = [1,2,3,4,5];
let head = new ListNode(0);
let tmp = head;
// head = [1,2,3,4,5], n = 2
while(arr.length) {
  const curr = arr.shift();
  tmp.next = new ListNode(curr);
  tmp = tmp.next;
};
head = head.next;
const result = removeNthFromEnd(head, 2);
// const head = new ListNode(1, );
