import fs from 'fs';
import Jimp = require('jimp');
import request from 'sync-request'
import isImage from 'is-image'

const isUrl = require('is-url')
const urlParse = require('url').parse


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.'+Math.floor(Math.random() * 2000)+'.jpg';
        await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(__dirname+outpath, (img)=>{
            resolve(__dirname+outpath);
        });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    for( let file of files) {
        fs.unlinkSync(file);
    }
}

// isImageUrl
// helper function to check if the url passed is a legit image url
// INPUTS
//    files: <string> url
// RETURNS
//    <boolean> true/false if the url is a legit image url
export function isImageUrl(url: string) {
    if (!url)
        return false

    const http = url.lastIndexOf('http')

    if (http != -1) {
        url = url.substring(http)
    }

    if (!isUrl(url)) {
        return isImage(url)
    }

    let pathname = urlParse(url).pathname

    if (!pathname) {
        return false
    }

    const last = pathname.search(/[:?&]/)

    if (last != -1) {
        pathname = pathname.substring(0, last)
    }

    if (isImage(pathname)) {
        return true
    }

    if (/styles/i.test(pathname)) {
        return false
    }

    try {
        const timeout = 60000

        const res = request('GET', url, { timeout })

        if (!res) {
            return false
        }

        const headers = res.headers

        if (!headers) {
            return false
        }

        const contentType = headers['content-type']

        if (!contentType) {
            return false
        }

        return contentType.search(/^image\//) != -1
  } catch (error) {
    return false
  }
}
