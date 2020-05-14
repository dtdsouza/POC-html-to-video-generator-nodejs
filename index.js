const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const videoshow = require('videoshow')
const { record } = require('puppeteer-recorder');

const images = []

const takeScreenshot = async (width, height, url) => {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox']
    })
  
    const page = await browser.newPage()
    await page.setViewport({
      width: width,
      height: height
    })
  
    await page.goto(url, { waitUntil: 'networkidle0' })

    let i = 0
    while (i < 100){
        const buffer = await page.screenshot()
        const imgPath = path.resolve(__dirname,'screenshots',`scheenshot${i}.png`)
        fs.writeFileSync(imgPath, buffer)
        images.push(imgPath)
        await timeout(30)
        ++i
    }

      await page.close()
      await browser.close()    
  }
  
  
  
  const timeout = (ms) => 
    new Promise(resolve => setTimeout(resolve, ms))
    
    
const makeVideo = async () => {
    await takeScreenshot(1920,1080,'https://temrysh.com/')
        
    const finalVideoPath = path.resolve(__dirname, 'videos', 'video.mp4')
    
    const videoOptions = {
      fps: 60,
      loop: 0.033,
      transition: false,
      transitionDuration: 0, // seconds
      videoBitrate: 1024,
      captionDelay: 0,
      videoCodec: 'libx264',
      size: '300x250',
      audioBitrate: '128k',
      audioChannels: 2,
      format: 'mp4',
      pixelFormat: 'yuv420p'
    }

    videoshow(images, videoOptions)
    .save(finalVideoPath)
    .on('start', function (command) { 
      console.log('encoding ' + finalVideoPath + ' with command ' + command) 
    })
    .on('error', function (err, stdout, stderr) {
      console.log('error: ', err)
    })
    .on('end', function (output) {
      console.log('result: ', output)
    })
}

makeVideo()