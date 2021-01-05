### 组件背景：用户在一定状态下弹窗提示
- `noOperate`长时间未操作；停留在页面(30分钟)后未进行任何页面操作(例如点击、滚动、鼠标移动)等，弹窗提示用户。
- `multiUser`多终端用户登录；当前账号在其他设备中登录，弹窗提示用户。

### 使用方法
`npm install @tntd/user-status-modal --save`


### 参数
|  参数   | 作用  |
|  ----  |  ----  |
|  lang  | 国际化`cn|en` |
|  modalShowEvent  | 显示弹窗时回调。结合当前业务：如果未传此回调方法但传dispatch函数，默认执行 `dispatch({ type: "login/signOut" });` |
|  modalCloseEvent  | 关闭弹窗回调。结合当前业务：如果未传此回调方法但传dispatch函数，默认执行 `dispatch({ type: "login/goLogin" });`  |
|  noOperateTime  | 停留页面时间设置,`noOperate`场景中可按照实际情况设置，默认30分钟 |
|  showModal  | `multiUser`多终端登录时可以根据用户传递控制是否显示弹窗，默认弹窗 |


```javascript
// 长时间未操作
 <NoOperate
    lang="cn"
    noOperateTime="100" // 静置时间
    modalShowEvent={()=>{ // 弹窗回调
        console.log(1)
    }}
    modalCloseEvent={()=>{ // 点击弹窗确定回调
        console.log(2)
    }}
/>


// 多用户登录
<MultiUser
    lang="cn"
    showModal={multiUserModal}
    modalShowEvent={() => {
        // 弹窗回调
        console.log(1)
    }}
    modalCloseEvent={() => {
        // 点击弹窗确定回调
        console.log(2)
    }}
/>
```
