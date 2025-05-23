
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
  'mountain climber': 'hZb6jTbCLeE', 
  'jumping jacks': '2W4ZNSwoW_4',
  'russian twist': '-BzNffL_6YE',
  'burpee': 'TU8QYVW0gDU',
  'push ups': 'ba8tr1NzwXU',
  'air squats': 'CsPAsICeRsM'
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
    console.log(`Using cached YouTube ID for ${exerciseInfo.name}: ${youtubeCache[key]}`);
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
  
  // Fallback to known exercises
  if (key.includes('push up') || key.includes('pushup')) {
    return 'ba8tr1NzwXU';
  }
  
  if (key.includes('squat')) {
    return 'CsPAsICeRsM';
  }
  
  if (key.includes('plank')) {
    return 'pSHjTRCQxIw';
  }
  
  if (key.includes('burpee')) {
    return 'TU8QYVW0gDU';
  }
  
  if (key.includes('lunge')) {
    return 'QOVaHwm-Q6U';
  }
  
  if (key.includes('mountain climber')) {
    return 'hZb6jTbCLeE';
  }
  
  if (key.includes('russian twist')) {
    return '-BzNffL_6YE';
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
  
  // Check common exercises
  if (key.includes('push up') || key.includes('pushup')) {
    return 'ba8tr1NzwXU';
  }
  
  if (key.includes('squat')) {
    return 'CsPAsICeRsM';
  }
  
  if (key.includes('plank')) {
    return 'pSHjTRCQxIw';
  }
  
  if (key.includes('burpee')) {
    return 'TU8QYVW0gDU';
  }
  
  if (key.includes('lunge')) {
    return 'QOVaHwm-Q6U';
  }
  
  if (key.includes('mountain climber')) {
    return 'hZb6jTbCLeE';
  }
  
  if (key.includes('russian twist')) {
    return '-BzNffL_6YE';
  }
  
  // If not in cache, trigger async fetch for next time
  getExerciseYoutubeId(exerciseInfo).then(videoId => {
    if (videoId) {
      youtubeCache[key] = videoId;
    }
  });
  
  return null;
};

