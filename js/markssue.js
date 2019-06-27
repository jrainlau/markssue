let issueBody = null
let markssue = null
let markssueSwitch = null

class Markssue {
  static onShow = false

  static init () {
    setInterval(() => {
      issueBody = document.querySelector('#issue_body') || document.querySelector('.comment-form-textarea')
      if (issueBody) {
        Markssue.createInstance()
      } else {
        Markssue.removeInstance()
      }
    }, 100);
  }

  static createInstance () {
    if (markssue) return

    const markssueHtml = `
    <div class="markssue-head">
      <img class="markssue-head-logo markssue_switch" src="https://raw.githubusercontent.com/jrainlau/markssue/master/imgs/logo3.png" />
      <span class="markssue-head-desc">麻薯 | Markssue</span>
    </div>
    <div class="markssue-content comment-body markdown-body js-preview-body"></div>
    <div class="markssue-side"></div>
    `

    markssue = document.createElement('div')
    markssue.setAttribute('class', Markssue.onShow ? 'markssue' : 'markssue hide')
    markssue.style.width = (localStorage.getItem('markssue_width') || 500) + 'px'
    markssue.innerHTML = markssueHtml
    document.body.appendChild(markssue)

    markssueSwitch = document.createElement('img')
    markssueSwitch.setAttribute('class', 'markssue_switch')
    markssueSwitch.setAttribute('src', 'https://raw.githubusercontent.com/jrainlau/markssue/master/imgs/logo3.png')
    document.querySelector('header').appendChild(markssueSwitch)

    Markssue.bindEvent()
    Markssue.syncScroll()
  }

  static removeInstance () {
    issueBody = null
    if (markssue) {
      document.body.removeChild(markssue)
      markssue = null
    }
    if (markssueSwitch) {
      document.querySelector('header').removeChild(markssueSwitch)
      markssueSwitch = null
    }
  }

  static bindEvent () {
    const markssueContent = document.querySelector('.markssue-content')
    const markssueSide = document.querySelector('.markssue-side')

    markssueContent.innerHTML = window.marked(issueBody.value)

    issueBody.addEventListener('input', (e) => {
      markssueContent.innerHTML = window.marked(e.target.value)
    })

    issueBody.addEventListener('change', (e) => {
      markssueContent.innerHTML = window.marked(issueBody.value)
    })

    let resizing = false
    let baseWidth = 0
    let [xStart, xDelta] = [0, 0]

    document.querySelectorAll('.markssue_switch').forEach(s => {
      s.addEventListener('click', () => {
        Markssue.onShow = !Markssue.onShow
        if (!Markssue.onShow) {
          markssue.classList.add('hide')
        } else {
          markssue.classList.remove('hide')
        }
      })
    })

    markssueSide.addEventListener('mousedown', (e) => {
      resizing = true
      baseWidth = markssue.getBoundingClientRect().width
      xStart = e.x
    })

    document.body.addEventListener('mousemove', (e) => {
      if (resizing) {
        xDelta = e.x - xStart
        markssue.style.width = baseWidth - xDelta + 'px'
      }
    })

    document.body.addEventListener('mouseup', () => {
      if (resizing) {
        resizing = false
        baseWidth = markssue.getBoundingClientRect().width
        localStorage.setItem('markssue_width', baseWidth)
      }
    })
  }

  static syncScroll () {
    let p = 0
    issueBody.addEventListener('scroll', (e) => {
      p = e.target.scrollTop / (e.target.scrollHeight - e.target.clientHeight)
      markssue.scrollTop = (markssue.scrollHeight - markssue.clientHeight) * p
    })
  }
}

Markssue.init()
