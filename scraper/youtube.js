const consts = require('./../consts');
const axios = require('axios').default;

async function getYoutubeVideoIds(searchTerm) {
    let nextPageToken = "";
    let idsArr = []
    let maxVideoIds = 50;
    const YOUTUBE_VIDEOS_SEARCH_API = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&key=${consts.API_KEY}&maxResults=50&order=viewCount&pageToken=${nextPageToken}`;
    try {
      while (idsArr.length < maxVideoIds) {
        let searchResponse = await axios.get(YOUTUBE_VIDEOS_SEARCH_API);
        let searchData = searchResponse.data;
        nextPageToken = searchData.nextPageToken;
        idsArr = idsArr.concat(searchData.items.map(item => item.id.videoId));
      }
      return idsArr;  
    } catch (error) {
      throw error;
    }
}
  
async function getVideoDetails(videoIds) {
    videoIds = videoIds.join();
    const YOTUBE_VIDEO_DETAILS_API = `https://youtube.googleapis.com/youtube/v3/videos?id=${videoIds}&key=${consts.API_KEY}&part=contentDetails,statistics,snippet`;
    try {
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
    } catch (error) {
        throw error;
    }
}
  
async function getRelatedVideosIds(videoId) {
    let nextPageToken = "";
    let idsArr = []
    let maxVideoIds = 50;
    try {
      while (idsArr.length < maxVideoIds) {
        const RELATED_YOUTUBE_IDS = `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${consts.API_KEY}`;
        let searchResponse = await axios.get(RELATED_YOUTUBE_IDS);
        let searchData = searchResponse.data;
        nextPageToken = searchData.nextPageToken;
        idsArr = idsArr.concat(searchData.items.map(item => item.id.videoId));
      }
      return idsArr;  
    } catch (error) {
      throw error;
    }
}

module.exports = {
    getYoutubeVideoIds,
    getVideoDetails,
    getRelatedVideosIds
}