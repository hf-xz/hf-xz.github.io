---
title: Day02-Progress Steps
---

<i class="fa fa-car" />

# Day02-Progress Steps

- [Live Demo](https://50projects50days.com/projects/progress-steps/)
- [CodePen](https://codepen.io/hfxuanzai/pen/BavvBQG)
- [Source Code](https://github.dev/bradtraversy/50projects50days/tree/master/progress-steps)

## 分析

<IFrame src="https://50projects50days.com/projects/progress-steps/" />

一个进度条和两个按钮。

点击 Next 或 Prev 会有对应的进度条前进后退动画，然后数字的圈也会变成蓝色。

进度在开始或者结束时对应的按钮会禁用并且变成灰色，点按有个微微变小。

在快速点击时，进度条是连续的，推测进度条是一整个元素而不是分段的。

## 实现

### 思路

对页面的元素进行拆解分析：

1. 进度节点：

    圆形边框，颜色渐变。用 border-radius 和 border-color 实现。

2. 进度条连线：

    颜色水平移动。用 background-position-x 实现。

3. 按钮：

    设置点击样式，js 控制 disabled 属性。

### 代码

:::detail code-group
```html
<div class="progress-bar">
  <div class="bar"></div>
  <div class="node">1</div>
  <div class="node">2</div>
  <div class="node">3</div>
  <div class="node">4</div>
</div>
<div class="btn-group">
  <button>Prev</button>
  <button>Next</button>
</div>
```
```css
body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  min-height: 100vh;
  margin: 0;
  background-color: #f6f7fb;
  font-family: Helvetica;
}

.progress-bar {
  width: 350px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.node {
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  background-color: #fff;
  font-size: 16px;
  color: #999;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  z-index: 5;

  transition: 0.3s;
  border: 3px solid #e0e0e0;
}
.node.activate {
  border-color: #3498db;
}

.bar {
  position: absolute;
  height: 5px;
  /* 查看进度条与节点的相对位置  */
  /* top: -20px; */
  /* 避免露出端口，并与节点对齐 */
  left: 15px;
  right: 15px;
  /* 背景颜色效果 */
  background-image: linear-gradient(to right, #e0e0e0 50%, #3498db 50%);
  background-size: 200%;

  /* 左右移动效果 */
  transition: 0.3s;
  background-position-x: 0%;
}

.btn-group {
  margin-top: 35px;
}
.btn-group button {
  color: #fff;
  height: 33px;
  width: 90px;
  font-weight: lighter;
  background-color: #3498db;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0;
  margin: 0 7px;
}
.btn-group button {
  color: #fff;
  height: 33px;
  width: 90px;
  border-radius: 5px;
  border: none;
  margin: 0 7px;
  background-color: #e0e0e0;
  cursor: not-allowed;
}
.btn-group button.activate {
  background-color: #3498db;
  cursor: pointer;
}
.btn-group button.activate:active {
  transform: scale(0.99);
}

```
```js
const [prevBtn, nextBtn] = document.querySelectorAll(".btn-group button");
const nodes = document.querySelectorAll(".node");
const bar = document.querySelector(".bar");
const totalStep = nodes.length;
const stepBarLength = 100 / (totalStep - 1);

let cur_step = 1;

// initial
update(1);

// bind linstener
prevBtn.addEventListener("click", () => {
  if (prevBtn.classList.contains("activate")) {
    update(cur_step - 1);
  }
});
nextBtn.addEventListener("click", () => {
  if (nextBtn.classList.contains("activate")) {
    update(cur_step + 1);
  }
});

function update(step) {
  console.log("step: ", step);
  // button state
  prevBtn.classList.add("activate");
  nextBtn.classList.add("activate");
  if (step <= 1) {
    prevBtn.classList.remove("activate");
  }
  if (step >= totalStep) {
    nextBtn.classList.remove("activate");
  }
  // node state
  nodes.forEach((node, index) => {
    if (index < step) {
      node.classList.add("activate");
    } else {
      node.classList.remove("activate");
    }
  });
  // bar state
  precent = (step - 1) * stepBarLength;
  bar.style.backgroundPositionX = `-${precent}%`;
  // update step
  cur_step = step;
}

```
:::

## 阅读

:::code-group
```html

```
```css

```
```js

```
:::

## 对比

## 总结

### CSS 属性选择器

*虽然最后没用到。*

要选中 `<button disabled>Next</button>` 这种有属性的标签，可以使用 CSS 的属性选择器 `button[disabled]` 这会选择所有有 `disabled` 标签的 `button` 。

如果根据属性的值选择的话，可以使用 `button[disbaled="true"]`，这只会选中 `<button disabled="true" />` 这样的元素。
