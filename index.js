import keyword from './keyword'
const $ = str => document.querySelector(str)
const myClick = (el = document, fn = () => { }) => el.addEventListener('click', fn)
const elObj = {
  root: $('#root'),
  phone: $('#phone'),
  header: $('#header'),
  main: $('#main'),
  keyword: $('#keyword'),
  footer: $('#footer'),
  keywordbg: $('#main .bg'),
  animation: $('#animation'),
  message: $('#message'),
  send: $('#send')
}

function sendMessage() {
  const inputval = elObj.message.value;
  inputval && pushMessage(inputval, '我', true)
}

// 发送按钮
myClick(elObj.send, () => sendMessage())
// fix: https://github.com/Wxh16144/float-emoji/issues/4
elObj.message.addEventListener('keyup', (e) => {
  if (e.key === 'Enter' || e.keyCode === 13) {
    sendMessage()
  }
})
//HTML转义
const HTMLEncode = html => {
  const el = document.createElement("div");
  el.textContent ? el.textContent = html : el.innerText = html
  return el.innerHTML;
}
// 追加聊天记录
const pushMessage = (str, name, ismyself) => {
  if (!str) return false;
  var html = `
    <p class="${ismyself ? 'myself' : 'opposite'}"
       style="--name:'${name}'">${HTMLEncode(str)}
    </p >
  `
  elObj.keyword.innerHTML += html;
  elObj.main.scrollTop = elObj.keyword.scrollHeight
  // 判断聊天内容有没有关键字
  const find = Object.keys(keyword).find(key => new RegExp(key, 'ig').test(str))
  const icon = keyword[find];
  icon && createAnimation(icon)
  elObj.keyword.scrollTop = elObj.keyword.scrollHeight;
  elObj.message.placeholder = Object.keys(keyword)[Math.floor(myRandom(0, Object.keys(keyword).length - 1))]
  elObj.message.value = ''
}

const myRandom = (min = 0, max = min + 1) => Math.random() * (max - min + 1) + min;
// 动画
const createAnimation = icon => {
  const { width, height, top, bottom } = elObj.main.getBoundingClientRect();
  const count = Math.round(width * height / 5000);
  const averageCount = Math.round(width / 65);
  const fw = width / averageCount;
  let numbercount = 0;
  let logo = icon;
  if (Array.isArray(icon)) {
    const index = myRandom(0, icon.length - 1)
    logo = icon[Math.floor(index)];
  }
  elObj.animation.style.zIndex = 99;
  [...Array(count).keys()].forEach(index => {
    let childEl = document.createElement('i');
    const left = (myRandom(1, fw) + fw) * (index % averageCount) + 'px';
    childEl.classList = 'icon-itme';
    childEl.innerText = logo || '😘'
    childEl.style.left = left
    childEl.style.position = 'absolute'
    childEl.style.fontSize = '32px';
    childEl.style.transform = `translate(${left},${-50}px)`;
    childEl.style.transition = `transform ${myRandom(3, 6)}s linear ${myRandom(1, 2)}s`;
    setTimeout(() => {
      childEl.style.transform = `translate(${myRandom(1, fw)}px,${height + 50}px) rotate(${myRandom(-90, 90)}deg)`
    }, 0)
    // 过渡结束后执行
    childEl.addEventListener('transitionend', ({ target }) => {
      target.parentNode.removeChild(target);
      if (++numbercount >= count) {
        elObj.animation.style.zIndex = 0
      }
    })
    elObj.animation.appendChild(childEl)
  })

}
window.keyword = keyword;