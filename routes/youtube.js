var express = require('express');
const { report } = require('../app');
const axios = require('axios').default;
const utils = require('./../utils/utils');
var router = express.Router();
const API_KEY = "AIzaSyDyl5DpuGW3oCWr79T2-JoiIJ8IUBA-aVQ";

/* GET youtube videos. */
router.get('/search', async function(req, res, next) {
  try {
    let videoIds = await getYoutubeVideoIds("home insurance");
    let videos = await getVideoDetails(videoIds);
    utils.exportObjectToExcel(videos, "Videos", "videos.xlsx");
    res.send('success');
  } catch (error) {
    res.send('error: ' + error);
  }
});

async function getYoutubeVideoIds(searchTerm) {
  let nextPageToken = "";
  let idsArr = []
  let maxVideoIds = 50;
  try {
    while (idsArr.length < maxVideoIds) {
      const YOUTUBE_VIDEOS_SEARCH_API = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${API_KEY}&maxResults=50&order=viewCount&pageToken=${nextPageToken}`;
      let searchResponse = await axios.get(YOUTUBE_VIDEOS_SEARCH_API);
      let searchData = searchResponse.data;
      nextPageToken = searchData.nextPageToken;
      idsArr = idsArr.concat(searchData.items.map(item => item.id.videoId));
    }
    return idsArr;  
  } catch (error) {
    console.log(error);
  }
}

async function getVideoDetails(videoIds) {
  videoIds = videoIds.join();
  const YOTUBE_VIDEO_DETAILS_API = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoIds}&key=${API_KEY}&part=contentDetails,statistics,snippet`;
  let videosResponse = await axios.get(YOTUBE_VIDEO_DETAILS_API);
  let videosData = videosResponse.data;
  let videos = [];
  for (let item of videosData.items) {
    let videoItem = {
      "id": item.id,
      "channelId": item.snippet && item.snippet.channelId,
      "channelTitle": item.snippet && item.snippet.channelTitle,
      "title": item.snippet && item.snippet.title,
      "description": item.snippet && item.snippet.description,
      "publishTime": item.snippet && item.snippet.publishTime,
      "duration": item.contentDetails && item.contentDetails.duration,
      "views": item.statistics && item.statistics.viewCount,
      "likes": item.statistics && item.statistics.likeCount,
      "favorites": item.statistics && item.statistics.favoriteCount,
      "comments": item.statistics && item.statistics.commentCount,
      "url": `https://www.youtube.com/watch?v=${item.id}`
    };
    videos.push(videoItem);
  }
  return videos;
}

async function getRelatedVideosIds(videoId) {
  let nextPageToken = "";
  let idsArr = []
  let maxVideoIds = 50;
  try {
    while (idsArr.length < maxVideoIds) {
      const RELATED_YOUTUBE_IDS = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${API_KEY}`;
      let searchResponse = await axios.get(RELATED_YOUTUBE_IDS);
      let searchData = searchResponse.data;
      nextPageToken = searchData.nextPageToken;
      idsArr = idsArr.concat(searchData.items.map(item => item.id.videoId));
    }
    return idsArr;  
  } catch (error) {
    console.log(error);
  }
}

module.exports = router;
