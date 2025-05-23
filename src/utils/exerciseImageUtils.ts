import { Exercise } from '@/types/exercise';

import { getExerciseYouTubeVideo } from './youtubeApiUtils';

// Cache for YouTube video IDs
const youtubeCache: {[key: string]: string} = {
  // Pre-cache some common exercise videos
  'push up': 'IODxDxX7oi4',
  'squat': 'gsNoPYwWXeE',
  'plank': 'pSHjTRCQxIw',
  'deadlift': 'ytGaGIn3SjE',
  'bench press': 'rT7DgCr-3pg',
  'pull up': 'eGo4IYlbE5g',
  'lunge': 'QOVaHwm-Q6U',
  'bicep curl': 'ykJmrZ5v0Oo',
  'tricep extension': 'nRiJVZDpdL0',
  'shoulder press': 'qEwKCR5JCog',
  'leg press': 'IZxQVV3E7nE',
  'lat pulldown': 'CAwf7n6Luuc',
  'crunches': 'Xyd_fa5zoEU',
  'mountain climber': 'cnyTQDSE884',
  'jumping jacks': '2W4ZNSwoW_4'
};

// Function to get the best image URL for an exercise
export const getBestExerciseImageUrlSync = (exercise: Exercise | any): string => {
  if (!exercise) return '';
  
  // Prioritize MuscleWiki images if available
  if (exercise.muscleWikiId) {
    return `https://musclewiki.com/media/uploads/${exercise.muscleWikiId}-300.jpg`;
  }
  
  // Use the provided gifUrl if available
  if (exercise.gifUrl) {
    return exercise.gifUrl;
  }
  
  // Fallback to a default image or empty string
  return "https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif";
};

export const getExerciseYoutubeId = async (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): Promise<string | null> => {
  if (!exerciseInfo?.name) return null;
  
  const key = exerciseInfo.name.toLowerCase();
  
  // Check cache first
  if (youtubeCache[key]) {
    return youtubeCache[key];
  }
  
  try {
    // Get video from YouTube API
    const videoId = await getExerciseYouTubeVideo(exerciseInfo);
    
    if (videoId) {
      // Update cache for future use
      youtubeCache[key] = videoId;
      return videoId;
    }
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
  }
  
  // Fallback to existing function logic
  if (exerciseInfo.name.toLowerCase().includes('push up')) {
    return 'IODxDxX7oi4';
  }
  
  if (exerciseInfo.name.toLowerCase().includes('squat')) {
    return 'gsNoPYwWXeE';
  }
  
  return null;
};

// Synchronous version for components that can't use async/await
export const getExerciseYoutubeIdSync = (exerciseInfo: {
  name: string;
  equipment?: string;
  bodyPart?: string;
  target?: string;
}): string | null => {
  if (!exerciseInfo?.name) return null;
  
  const key = exerciseInfo.name.toLowerCase();
  
  // Check cache first
  if (youtubeCache[key]) {
    return youtubeCache[key];
  }
  
  // If not in cache, return null but trigger async fetch for next time
  getExerciseYoutubeId(exerciseInfo).then(videoId => {
    if (videoId) {
      youtubeCache[key] = videoId;
    }
  });
  
  return null;
};
