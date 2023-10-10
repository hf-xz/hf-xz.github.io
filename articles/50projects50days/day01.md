---
title: Day01-Expanding Cards
---

# Day01-Expanding Cards

- [Live Demo](https://50projects50days.com/projects/expanding-cards/)
- [CodePen](https://codepen.io/hfxuanzai/pen/mdaKVgb)
- [Source Code](https://github.dev/bradtraversy/50projects50days/tree/master/expanding-cards)

![Expanding Cards](https://image-1306852633.cos.ap-beijing.myqcloud.com/image-20231010115345836.png)

## 分析

几个卡片水平排列，其中只有一个卡片展开，其他卡片则折叠（宽度很窄）。

展开的卡片左下角有卡片的标题。

点击某个折叠的卡片会发生：

1. 原先展开的卡片折叠、标题消失
2. 被点击的卡片展开、标题出现

其中，折叠、展开、标题出现都是有动画的。折叠和展开的时间一样，标题出现有渐入，消失是直接消失。

## 实现

### 思路

用 flex 布局，用 flex 属性控制宽度（也就是折叠）。

用 css 控制动画效果。

用 js 给元素增减类来实现点击效果。

### 代码

:::code-group
```html
<div class="container">
  <div class="card" style="background-image: url('https://images.unsplash.com/photo-1558979158-65a1eaa08691?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h2>Explore The World</h2>
  </div>
  <div class="card" style="background-image: url('https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h2>Wild Forest</h2>
  </div>
  <div class="card" style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80')">
    <h2>Sunny Beach</h2>
  </div>
  <div class="card" style="background-image: url('https://images.unsplash.com/photo-1551009175-8a68da93d5f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80')">
    <h2>City on Winter</h2>
  </div>
  <div class="card" style="background-image: url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h2>Mountains - Clouds</h2>
  </div>
</div>
```
```css
.container {
  width: 88vw;
  height: 80vh;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: row;
  gap: 20px;
}

.card {
  height: 100%;
  border-radius: 50px;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;

  transition: 1s ease-in-out;
  flex: 1;
}
.card.selected {
  flex: 10; /* 选中的元素展开 */ // [!code hl]
}

.card h2 {
  margin: 0;
  color: white;
  font-family: Helvetica;
  position: absolute;
  bottom: 20px;
  left: 20px;

  /* 通过不给 visibility 设置 transition 来实现直接消失，渐入出现 */ // [!code hl]
  transition: opacity 0.5s 0.5s; // [!code hl]
  visibility: hidden; // [!code hl]
  opacity: 0; // [!code hl]
}
.card.selected h2 {
  visibility: visible;
  opacity: 1;
}
```
```js
let cards = document.querySelectorAll(".card");

let selected = 0;
cards[selected].classList.add("selected");

cards.forEach((card, index) => {
  card.addEventListener("click", (e) => {
    cards[selected].classList.remove("selected");
    cards[index].classList.add("selected");
    selected = index;
  });
});
```
:::

## 阅读

:::code-group
```html
<div class="container">
  <div class="panel active" style="background-image: url('https://images.unsplash.com/photo-1558979158-65a1eaa08691?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h3>Explore The World</h3>
  </div>
  <div class="panel" style="background-image: url('https://images.unsplash.com/photo-1572276596237-5db2c3e16c5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h3>Wild Forest</h3>
  </div>
  <div class="panel" style="background-image: url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1353&q=80')">
    <h3>Sunny Beach</h3>
  </div>
  <div class="panel" style="background-image: url('https://images.unsplash.com/photo-1551009175-8a68da93d5f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1351&q=80')">
    <h3>City on Winter</h3>
  </div>
  <div class="panel" style="background-image: url('https://images.unsplash.com/photo-1549880338-65ddcdfd017b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80')">
    <h3>Mountains - Clouds</h3>
  </div>
</div>
```
```css
@import url('https://fonts.googleapis.com/css?family=Muli&display=swap');

* {
  box-sizing: border-box;
}

body {
  font-family: 'Muli', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: hidden;
  margin: 0;
}

.container {
  display: flex;
  width: 90vw;
}

.panel {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 80vh;
  border-radius: 50px;
  color: #fff;
  cursor: pointer;
  flex: 0.5;
  margin: 10px;
  position: relative;
  -webkit-transition: all 700ms ease-in;
}

.panel h3 {
  font-size: 24px;
  position: absolute;
  bottom: 20px;
  left: 20px;
  margin: 0;
  opacity: 0;
}

.panel.active {
  flex: 5;
}

.panel.active h3 {
  opacity: 1;
  transition: opacity 0.3s ease-in 0.4s;  // [!code hl]
}

@media (max-width: 480px) { // [!code hl]
  .container { // [!code hl]
    width: 100vw; // [!code hl]
  } // [!code hl]
 // [!code hl]
  .panel:nth-of-type(4), // [!code hl]
  .panel:nth-of-type(5) { // [!code hl]
    display: none; // [!code hl]
  } // [!code hl]
} // [!code hl]
```
```js
const panels = document.querySelectorAll('.panel')

panels.forEach(panel => {
    panel.addEventListener('click', () => {
        removeActiveClasses()
        panel.classList.add('active')
    })
})

function removeActiveClasses() {
    panels.forEach(panel => {
        panel.classList.remove('active')
    })
}
```
:::

## 对比

大部分实现都差不多，主要的区别在 css 里高亮的部分。

1. 通过将动画设置给 `activate` 的类就可以实现直接消失，渐入出现，比我的做法好。
2. 通过 `@media` 媒体查询做了响应式处理，避免了窗口过窄时效果不佳的问题。

## 总结

### `flex-grow`, `flex-shrink`, `flex-basis` 与 `flex` ：

`flex-basis` 设定了 flex 元素的基础大小，然后在这个基础大小设定之后，会根据容器的大小和元素的 `flex-grow` 和 `flex-shrink` 属性调整元素的大小，最后达到一个合适的尺寸。

`flex` 属性是上述三个属性的简写属性，具体规则可以查看 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/CSS/flex) ，在我们的代码中（`flex: 10;`）用到的是单值语法的一种，会被扩写为 `flex: 10 1 0;` 即 `flex-grow: 10; flex-shrink: 1; flex-basis: 0;`

### `border-radius` 特性：

当设定的半径大于可用的半径，实际显示的半径会缩小为最大可用半径（如半径为50px，但宽度总共只有60px，那么最后半径为30px）。

### 只有出现有动画：

当我们想让元素只有出现有动画，而消失没有动画时，可以将 `transiation` 设置在出现之后的类（如 `selected`, `activate`）上。

### 媒体查询：

要学会使用媒体查询来做响应式处理。
