let puppeteer = require('puppeteer');
let cheerio = require('cheerio')
let request = require('request');
let fs = require('fs');
var browser, page;
const config = {
    baseUrl: 'https://www.instagram.com/accounts/login/?source=auth_switcher', 
    username: 'systemofpeter',
    password: 'Since2002',
    hashtag: {
        "username_field": "input[type=\"text\"]",
        "password_field": "input[type=\"password\"]",
        'login_button': "button[type=submit]",
        'username_tag_wall': '#react-root',
        'container_group': '#react-root', //   .COOzN .m0NAq .nwXS6
        'username_wall_field': '.glyphsSpriteMobile_nav_type_logo.u-__7', //  > .SCxLW > ._1SP8R > .COOzN > .gmFkV,
        'notnoti': "#react-root",
        'follower_container': 'isgrP',
        'confering_button': '_0mzm- sqdOP  L3NKy   _8A5w5    ',
        'confering_username': 'FPmhX '
    }
}

async function login(){
    await page.goto(config.baseUrl);
    await page.waitForSelector(config.hashtag.username_field);
    await page.type(config.hashtag.username_field, config.username);
    await page.type(config.hashtag.password_field, config.password);
    await page.click(config.hashtag.login_button);
    //await page.waitForSelector(config.hashtag.container_group);
    await page.waitForNavigation();
    await confering();
}

async function confering(){
    await page.goto(`https://www.instagram.com/${config.username}`);
    await page.waitForSelector(config.hashtag.container_group);
    await page.evaluate(() => {
        var el = document.getElementsByClassName('-nal3');
        el[2].click();
        return true;
    })

    await page.waitFor(3500);
    await autoScrollDom('isgrP');

    await page.evaluate((tag=[]) => {
        var elements = Array.from(document.getElementsByClassName(tag[0])); 
        var username = Array.from(document.getElementsByClassName(tag[1])).map(item => item.innerHTML);
        const unfollow = index => {
            if(username[index] == 'hey.per') return unfollow(index + 1);
            elements[index].click();
            var timer = setTimeout(() => {
                if(index == elements.length -1){
                    clearTimeout(timer);
                    return ;
                } 
                
                var unfollowButton = document.getElementsByClassName('aOOlW -Cab_   ')[0];
                unfollowButton.click();
                setTimeout(() => unfollow(index + 1), 1000);
            }, 1000)
        }
        
        unfollow(1);
        return true;
    }, [config.hashtag.confering_button, config.hashtag.confering_username]);
    
    let usernames = await page.evaluate(() => Array.from(document.getElementsByClassName('FPmhX ')).map(item => item.innerHTML))
    console.log(`Done task`);
    console.log(usernames);
}

async function getImgSources(){
    await page.setViewport({width: 1200, height: 800});
    await autoScroll();
    const imageSrcSets = await page.evaluate(() => {
        const imgs = Array.from(document.querySelectorAll('article img'))
        const srcSetAttribute = imgs.map(i => i.getAttribute('srcset'))
        return srcSetAttribute;
    })

    for(let i = 0; i < imageSrcSets.length; i++){
        const srcSet = imageSrcSets[i];
        const splitedSrcs = srcSet.split(',');
        const imgSrc = splitedSrcs[splitedSrcs.length - 1].split(' ')[0]
        console.log(imgSrc)
    }
}

async function autoScrollDom(domName){
    await page.evaluate(async className => {
        await new Promise((resolve, reject) => {
            var total = 0;
            var distance = 500;
            var container = document.getElementsByClassName(className)[0];
            var timer = setInterval(() => {
                container.scrollTop += distance;
                total += distance;
                var scrollHeight = container.scrollHeight + 10000;
                if(total >= scrollHeight){
                    resolve();
                    clearInterval(timer);
                }
            }, 500);
        })
    }, domName) 
}

async function autoScroll(){
   await page.evaluate(async () => {
       await new Promise((resolve, reject) => {
           var totalHeight = 0;
           var distance = 1000;
           var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
           }, 100)
       })
   })  
}

async function main(){
    browser = await puppeteer.launch({headless: false});
    page = await browser.newPage();
    await login();
}


main();