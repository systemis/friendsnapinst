var puppeteer = require('puppeteer');
var browser, page;
const config = {
    account: {username: 'quangminhmlchik@gmail.com', password: '123456789nhat'},
    hashtag: {
        baseUriL: 'https://m.facebook.com/',
        usernameField: '#m_login_email',
        passwordField: '#m_login_password',
        lastingScreen: '_54k8 _56bs _26vk _56b_ _56bw _56bt _52jg',
        requestFriendButton: '_19no ',
        friendListTagButton: '_25n3 _58f0 _4_d1 scrollAreaColumn',
        friendssender: '_52jh _5pxc'
    }
}

async function scrollPage(){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            const distanceTime = 500;
            const distanceHeight = 700;
            var totalHeight = 0;
            var timer = setInterval(() => {
                let scrollHeight = document.body.scrollHeight;
                if(totalHeight > scrollHeight || totalHeight > 5000){
                    clearInterval(timer);
                    resolve();
                }

                totalHeight += distanceHeight;
                window.scrollBy(0, distanceHeight);
            }, distanceTime)
        })
    }) 
}

async function main(){
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await page.goto(config.hashtag.baseUriL);
    await page.waitFor(2500);
    await page.type(config.hashtag.usernameField, config.account.username);
    await page.type(config.hashtag.passwordField, config.account.password);
    await page.click("button[name='login']")
    await page.waitFor(2000);
    var testing = await page.evaluate(domName => {
        const dom = document.getElementsByClassName(domName);
        if(dom.length <= 0) return false;
        dom[0].click();
        return dom.length;
    }, config.hashtag.lastingScreen);
    await page.waitFor(1500);
    await page.evaluate(domName => {
        const dom = document.getElementsByClassName(domName);
        if(dom.length <= 0) return false;
        dom[1].click();
        return true;
    }, config.hashtag.requestFriendButton)
    await page.waitFor(1500);
    await page.evaluate(domName => {
        const dom = document.getElementsByClassName(domName);
        if(dom.length <= 0) return false;
        dom[4].click();
        return true;
    }, config.hashtag.friendListTagButton);
    await page.waitFor(2000);
    await scrollPage();
    var friendstesting = await page.evaluate(domName => {
        const doms = Array.from(document.getElementsByClassName(domName));
        return doms.map(item => item.textContent);
    }, config.hashtag.friendssender)
    
    console.log(testing);
    console.log(friendstesting);
    console.log('Done login to newfeed');
}

main();