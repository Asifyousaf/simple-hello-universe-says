
const YOUTUBE_API_KEY = 'AIzaSyASn_PHG4VCpNEMGGhrKEgzvP8_Vi8sZ5o';

/**
 * Fetches YouTube videos based on search query
 * @param query Search term
 * @param maxResults Maximum number of results to return
 * @returns Promise with search results
 */
export const searchYouTubeVideos = async (query: string, maxResults: number = 5) => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle
    }));
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return [];
  }
};

/**
 * Gets a YouTube video ID for a specific exercise
 * @param exerciseInfo Exercise information
 * @returns Promise with YouTube video ID
 */
export const getExerciseYouTubeVideo = async (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): Promise<string | null> => {
  try {
    // Construct a specific query for better results
    let query = exerciseInfo.name;
    if (exerciseInfo.equipment && exerciseInfo.equipment !== 'body weight') {
      query += ` ${exerciseInfo.equipment}`;
    }
    if (exerciseInfo.target) {
      query += ` ${exerciseInfo.target} muscle`;
    }
    query += ' exercise proper form';
    
    const videos = await searchYouTubeVideos(query, 1);
    return videos.length > 0 ? videos[0].id : null;
  } catch (error) {
    console.error('Error getting exercise YouTube video:', error);
    return null;
  }
};

/**
 * Batch pre-fetch YouTube videos for multiple exercises
 * @param exercises List of exercises
 * @returns Promise with mapping of exercise name to YouTube ID
 */
export const batchFetchExerciseVideos = async (exercises: any[]): Promise<{[key: string]: string}> => {
  const videoMap: {[key: string]: string} = {};
  
  // Process in batches to avoid rate limiting
  const batchSize = 5;
  for (let i = 0; i < exercises.length; i += batchSize) {
    const batch = exercises.slice(i, i + batchSize);
    const promises = batch.map(exercise => 
      getExerciseYouTubeVideo(exercise)
        .then(videoId => {
          if (videoId) {
            videoMap[exercise.name] = videoId;
          }
        })
    );
    
    // Wait for batch to complete
    await Promise.all(promises);
    
    // Add small delay between batches to avoid rate limiting
    if (i + batchSize < exercises.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return videoMap;
};
