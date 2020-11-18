var express = require('express');
const { report } = require('../app');
const utils = require('./../utils/utils');
const scraper = require('./../scraper/youtube');
var router = express.Router();

/* GET youtube videos. */
router.get('/search', async function(req, res, next) {
  try {
    let videoIds = await scraper.getYoutubeVideoIds("home insurance");
    let videos = await scraper.getVideoDetails(videoIds);
    utils.exportObjectToExcel(videos, "Videos", "videos.xlsx");
    res.send('success');
  } catch (error) {
    res.send('error: ' + error);
  }
});

module.exports = router;
