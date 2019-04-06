const express = require('express');
const url = require('url');
const morgan = require('morgan');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const expresssession = require('express-session');
const bodyParser = require('body-parser');
const puppeteer = require('puppeteer');
const socketManager = require('./server/socket');
const fs = require('fs');

app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));
app.use(express.static(path.resolve(__dirname, './build')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expresssession({
  secret: 'secret',
  saveUninitialized: true
}))

var browser, page;
const config = {
  destinationFolder: './test',
  url: 'https://www.facebook.com/',
  mUrl: 'https://m.facebook.com/',
  messchaturl: 'https://m.facebook.com/messages/read/?tid=100010901538999&entrypoint=web%3Atrigger%3Ajewel_see_all_messages',
  account: {
    username: 'quangminhmlchik@gmail.com',
    password: '123456789quangminh'
  },

  hashtags: {
    usernameLoginField: '#email',
    passwordLoginField: '#pass',
    loginButton: "button[value='Đăng nhập']",
    avatarprofileButton: '_2s25 _606w',
    friendListButton: 'u_fetchstream_1_1',
    friendNameItem: 'fsl fwb fcb',
    friendAvatarItem: '_5q6s _8o _8t lfloat _ohe',
    friendImageItem: '_s0 _4ooo _1x2_ _1ve7 _rv img',
    profile: {
      infoButtonLabel: '_39g6',
      uiMediaThumbImg: 'uiMediaThumbImg',
    },

    mobile: {
      usernameField: '#m_login_email',
      passwordField: '#m_login_password',
      loginButton: '_54k8 _52jh _56bs _56b_ _28lf _56bw _56bu',
      welcomeButton: '_54k8 _56bs _26vk _56b_ _56bw _56bt _52jg',
      messField: '#composerInput',
      sendMessButton: "button[value='Gửi']",
    },
  }
}

async function init() {
  if (!fs.existsSync(config.destinationFolder)) {
    fs.mkdirSync(config.destinationFolder);
  }

  // Showing loading terminal ui 
  var loading = (function () {
    var h = ['|', '/', '-', '\\'];
    var i = 0;

    return setInterval(() => {
      i = (i > 3) ? 0 : i;
      console.clear();
      console.log('Loading 👋 👋 👋', h[i]);
      i++;
    }, 300);
  })();

  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(config.url);
  await page.waitFor(3000);
  await page.type(config.hashtags.usernameLoginField, config.account.username);
  await page.type(config.hashtags.passwordLoginField, config.account.password);
  await page.evaluate(() => document.getElementById('loginbutton').childNodes[0].click());

  await page.waitFor(3000);
  await clickElementByClassname(config.hashtags.avatarprofileButton);
  await page.waitForNavigation();
  clearInterval(loading);
  console.log('Ready for clients 💯💯💯');
}

async function initForMobile() {
  browser = await puppeteer.launch({ headless: true });
  page = await browser.newPage();
  await page.goto(config.mUrl);
  await page.waitFor(2000);
  await page.type(config.hashtags.mobile.usernameField, config.account.username);
  await page.type(config.hashtags.mobile.passwordField, config.account.password);
  await page.click("button[value='Đăng nhập']");
  await page.waitForNavigation();
  await page.evaluate(bundle => {
    document.getElementsByClassName(bundle.classname)[0].click();
    window.location.href = bundle.href;
  }, { classname: config.hashtags.mobile.welcomeButton, href: config.messchaturl });

  await page.waitFor(2000);
  await page.type(config.hashtags.mobile.messField, 'Dit me thang loz mat day');
  await page.click(config.hashtags.mobile.sendMessButton);
  return;
}

async function scrollPage() {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      const distanceTime = 500;
      const distanceHeight = 700;
      var totalHeight = 0;
      var timer = setInterval(() => {
        if (totalHeight > 40000) {
          clearInterval(timer);
          resolve();
        }

        totalHeight += distanceHeight;
        window.scrollBy(0, distanceHeight);
      }, distanceTime)
    })
  })
}

async function clickElementByClassname(classname) {
  await page.evaluate(nameDom => {
    let element = document.getElementsByClassName(nameDom)[0];
    if (!element) return false;
    return element.click();
  }, classname);
}

async function getListFriend() {
  const results = await page.evaluate(domnames => {
    let names = Array.from(document.getElementsByClassName(domnames.names));
    let images = Array.from(document.getElementsByClassName(domnames.images));
    let profiles = Array.from(document.getElementsByClassName(domnames.avatars));
    var nodes = [];
    if (names.length <= 0) return [];
    for (let i = 0; i < names.length; i++) {
      let name = names[i].textContent;
      let image = images[i] ? images[i].getAttribute('src') : '';
      let profile = profiles[i] ? profiles[i].getAttribute('href') : '';
      nodes.push({ image, name, profile });
    }

    return nodes;
  }, {
      names: config.hashtags.friendNameItem,
      images: config.hashtags.friendImageItem,
      avatars: config.hashtags.friendAvatarItem
    })

  console.log(results);
  return results;
}

app.post('/api/get-friends-list', async (req, res) => {
  console.log('get friends list');
  await page.evaluate(() => window.location.href = `${window.location.href}/friends`);
  await page.waitFor(2500);
  await scrollPage();
  console.log('Scroll Done');
  try {
    let result = await getListFriend();
    console.log(result);
    res.send({ error: null, result });
  } catch (error) {
    console.log(error);
    res.send({ error, result: null });
  }
})

app.post('/test', (req, res) => {
  console.log(req.body);
})

app.post('/api/get-photos/', async (req, res) => {
  let href = req.body.href;
  await page.goto(href);
  await page.evaluate(name => {
    let element = document.getElementsByClassName(name)[0] || '';
    if (!element) return false;
    element.click();
  }, config.hashtags.profile.infoButtonLabel);

  await page.waitFor(2500);
  try {
    let sources = await page.evaluate(name => {
      let freshSource = (source = '') => source.replace('url', '').replace('(', '').replace(')', '');
      let imgs = Array.from(document.getElementsByClassName(name));
      let sources = imgs.map(img => freshSource(img.style.backgroundImage));
      return sources;
    }, config.hashtags.profile.uiMediaThumbImg);
    res.send({ error: null, result: sources });
  } catch (error) {
    res.send({ error: error, result: [] });
  }
})

new socketManager(server);
server.listen(process.env.PORT || 1999, async () => {
  await init();
})