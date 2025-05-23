
const YOUTUBE_API_KEY = 'AIzaSyASn_PHG4VCpNEMGGhrKEgzvP8_Vi8sZ5o';

/**
 * Fetches YouTube videos based on search query
 * @param query Search term
 * @param maxResults Maximum number of results to return
 * @returns Promise with search results
 */
export const searchYouTubeVideos = async (query: string, maxResults: number = 5) => {
  try {
    console.log(`Searching YouTube for: "${query}" (max results: ${maxResults})`);
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=${maxResults}&q=${encodeURIComponent(query)}&key=${YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Found ${data.items?.length || 0} videos for query "${query}"`);
    
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
    
    console.log(`Searching for exercise video with query: "${query}"`);
    const videos = await searchYouTubeVideos(query, 1);
    
    if (videos.length > 0) {
      console.log(`Found video ID ${videos[0].id} for exercise ${exerciseInfo.name}`);
      return videos[0].id;
    } else {
      console.log(`No videos found for exercise ${exerciseInfo.name}`);
      return null;
    }
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
  console.log(`Batch fetching videos for ${exercises.length} exercises`);
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
    console.log(`Completed batch ${Math.floor(i/batchSize) + 1}, found ${Object.keys(videoMap).length} videos so far`);
    
    // Add small delay between batches to avoid rate limiting
    if (i + batchSize < exercises.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Completed batch fetch, found ${Object.keys(videoMap).length} videos total`);
  return videoMap;
};

/**
 * Searches YouTube for workout videos based on a query
 * @param query Search query
 * @returns Promise with search results
 */
export const searchWorkoutVideos = async (query: string): Promise<any[]> => {
  try {
    const searchQuery = `${query} workout fitness exercise`;
    console.log(`Searching for workout videos with query: "${searchQuery}"`);
    
    const videos = await searchYouTubeVideos(searchQuery, 8);
    return videos;
  } catch (error) {
    console.error('Error searching workout videos:', error);
    return [];
  }
};

/**
 * Gets popular workout videos for different categories
 * @returns Promise with popular workout videos by category
 */
export const getPopularWorkoutVideos = async (): Promise<{[key: string]: any[]}> => {
  const categories = [
    {name: 'HIIT', query: 'HIIT workout'},
    {name: 'Strength', query: 'strength training workout'},
    {name: 'Cardio', query: 'cardio workout'},
    {name: 'Yoga', query: 'yoga fitness'}
  ];
  
  const results: {[key: string]: any[]} = {};
  
  for (const category of categories) {
    try {
      const videos = await searchYouTubeVideos(category.query, 3);
      results[category.name] = videos;
    } catch (error) {
      console.error(`Error fetching ${category.name} videos:`, error);
      results[category.name] = [];
    }
    
    // Add small delay between categories to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return results;
};

