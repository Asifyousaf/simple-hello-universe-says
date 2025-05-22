// This utility provides reliable exercise animations from API sources
import { Exercise } from '@/types/exercise';

// Map of exercise YouTube IDs for common exercises
const exerciseYoutubeIDs: Record<string, string> = {
  "push up": "IODxDxX7oi4",
  "pushup": "IODxDxX7oi4",
  "push-up": "IODxDxX7oi4",
  "squat": "gsNEn1c4iTw",
  "jumping jack": "c4DAnQ6DtF8",
  "jumping jacks": "c4DAnQ6DtF8",
  "plank": "pSHjTRCQxIw",
  "lunge": "QOVaHwm-Q6U",
  "burpee": "TU8QYVW0gDU",
  "mountain climber": "nmwgirgXLYM",
  "mountain climbers": "nmwgirgXLYM",
  "crunch": "Xyd_fa5zoEU",
  "sit up": "1fbU_MkV7NE",
  "sit-up": "1fbU_MkV7NE",
  "deadlift": "ytGaGIn3SjE",
  "pull up": "eGo4IYlbE5g",
  "pull-up": "eGo4IYlbE5g",
  "bench press": "rT7DgCr-3pg",
  // Added machine-based exercises
  "treadmill": "9L1-a9T7QQM", 
  "elliptical": "xQNpaW5fzjA",
  "stationary bike": "fYsF7TwJPVs",
  "rowing machine": "H0r_ZPXJLtg",
  "leg press": "IZxyjW7MPJQ",
  "chest press": "xQMFQT9pxqY",
  "lat pulldown": "CAwf7n6Luuc",
  "cable row": "GZbfZ033f74",
  "leg extension": "YyvSfVjQeL0",
  "leg curl": "1Tq3QdYUuHs",
  "pec deck": "Qz8Nl4X-UPw",
  "cable fly": "WEM9FCIPlcQ",
  "cable tricep pushdown": "2-LAMcpzODU",
  "cable bicep curl": "NFzTWp2qbIw",
  "smith machine squat": "Fk8rUQyQga4",
  "hack squat": "EdtaJRBqwes"
};

// MuscleWiki image URLs for common exercises
const muscleWikiImages: Record<string, string> = {
  "squat": "https://musclewiki.com/media/uploads/male-bodyweight-squat-side.gif",
  "push up": "https://musclewiki.com/media/uploads/male-pushup-side.gif",
  "pushup": "https://musclewiki.com/media/uploads/male-pushup-side.gif",
  "push-up": "https://musclewiki.com/media/uploads/male-pushup-side.gif",
  "lunge": "https://musclewiki.com/media/uploads/male-bodyweight-lunge-side.gif",
  "plank": "https://musclewiki.com/media/uploads/male-plank-side.gif",
  "crunch": "https://musclewiki.com/media/uploads/male-crunch-side.gif",
  "sit up": "https://musclewiki.com/media/uploads/male-situp-side.gif",
  "sit-up": "https://musclewiki.com/media/uploads/male-situp-side.gif",
  "deadlift": "https://musclewiki.com/media/uploads/male-deadlift-side.gif",
  "pull up": "https://musclewiki.com/media/uploads/male-pullup-side.gif",
  "pull-up": "https://musclewiki.com/media/uploads/male-pullup-side.gif",
  "bench press": "https://musclewiki.com/media/uploads/male-benchpress-side.gif",
  "calf raise": "https://musclewiki.com/media/uploads/male-bodyweight-calf-raise-side.gif",
  "jumping jack": "https://musclewiki.com/media/uploads/male-jumpingjack-front.gif",
  "jumping jacks": "https://musclewiki.com/media/uploads/male-jumpingjack-front.gif",
  "mountain climber": "https://musclewiki.com/media/uploads/male-mountainclimber-side.gif",
  "mountain climbers": "https://musclewiki.com/media/uploads/male-mountainclimber-side.gif",
  "burpee": "https://musclewiki.com/media/uploads/male-burpee-side.gif",
  "tricep dip": "https://musclewiki.com/media/uploads/male-tricep-dips-side.gif",
  "bicycle crunch": "https://musclewiki.com/media/uploads/male-bicycle-crunch-side.gif",
  "glute bridge": "https://musclewiki.com/media/uploads/male-glute-bridge-side.gif",
  "russian twist": "https://musclewiki.com/media/uploads/male-russian-twist-front.gif",
  // Added machine-based exercises
  "leg press": "https://musclewiki.com/media/uploads/male-legpress-side.gif",
  "chest press": "https://musclewiki.com/media/uploads/male-machine-chestpress-side.gif",
  "lat pulldown": "https://musclewiki.com/media/uploads/male-cable-lat-pulldown-side.gif",
  "cable row": "https://musclewiki.com/media/uploads/male-cable-seatedrow-side.gif",
  "leg extension": "https://musclewiki.com/media/uploads/male-leg-extension-side.gif",
  "leg curl": "https://musclewiki.com/media/uploads/male-leg-curl-side.gif",
  "cable fly": "https://musclewiki.com/media/uploads/male-cable-fly-side.gif",
  "cable tricep pushdown": "https://musclewiki.com/media/uploads/male-cable-pushdown-side.gif",
  "cable bicep curl": "https://musclewiki.com/media/uploads/male-cable-bicep-curl-side.gif",
  "hack squat": "https://musclewiki.com/media/uploads/male-machine-hack-squat-side.gif",
  "smith machine squat": "https://musclewiki.com/media/uploads/male-smith-squat-side.gif",
  "pec deck": "https://musclewiki.com/media/uploads/male-machine-chest-fly-side.gif",
  "treadmill run": "https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif",
  "stationary bike": "https://musclewiki.com/media/uploads/male-cardio-exercise-bike-side.gif",
  "elliptical": "https://musclewiki.com/media/uploads/male-cardio-elliptical-side.gif",
  "rowing machine": "https://musclewiki.com/media/uploads/male-cardio-rowing-machine-side.gif"
};

// WorkoutLabs image URLs for additional exercises
const workoutLabsImages: Record<string, string> = {
  "jump squat": "https://workoutlabs.com/wp-content/uploads/watermarked/Jump_Squat1.gif",
  "jumping squat": "https://workoutlabs.com/wp-content/uploads/watermarked/Jump_Squat1.gif",
  "push-up rotation": "https://workoutlabs.com/wp-content/uploads/watermarked/Push-up_with_Rotation1.gif",
  "side plank": "https://workoutlabs.com/wp-content/uploads/watermarked/Side_Forearm_Plank.gif",
  "superman": "https://workoutlabs.com/wp-content/uploads/watermarked/Superman1.gif",
  "high knees": "https://workoutlabs.com/wp-content/uploads/watermarked/High_Knees_Run_in_Place.gif",
  "leg raise": "https://workoutlabs.com/wp-content/uploads/watermarked/Lying_Straight_Leg_Raises.gif",
  "wall sit": "https://workoutlabs.com/wp-content/uploads/watermarked/Wall_Sit.gif",
  "bird dog": "https://workoutlabs.com/wp-content/uploads/watermarked/Bird_dogs1.gif",
  "kettlebell swing": "https://workoutlabs.com/wp-content/uploads/watermarked/Kettlebell_Swing1.gif",
  // Added machine-based exercises
  "treadmill": "https://workoutlabs.com/wp-content/uploads/watermarked/Treadmill_Running1.gif",
  "stationary bike": "https://workoutlabs.com/wp-content/uploads/watermarked/Stationary_Bike1.gif",
  "rowing machine": "https://workoutlabs.com/wp-content/uploads/watermarked/Rowing_Machine1.gif",
  "elliptical": "https://workoutlabs.com/wp-content/uploads/watermarked/Elliptical_Trainer1.gif",
  "cable chest fly": "https://workoutlabs.com/wp-content/uploads/watermarked/Cable_Chest_Fly1.gif",
  "hamstring curl": "https://workoutlabs.com/wp-content/uploads/watermarked/Seated_Leg_Curl_Machine.gif",
  "lat pulldown": "https://workoutlabs.com/wp-content/uploads/watermarked/Lat_Pulldown1.gif",
  "chest press machine": "https://workoutlabs.com/wp-content/uploads/watermarked/Chest_Press_Machine.gif"
};

// API endpoints for MuscleWiki API
const MUSCLEWIKI_API_BASE = "https://musclewiki.com/api/exercises";

// An array of reliable workout GIF animations as fallbacks
const reliableAnimations = [
  "https://media1.tenor.com/m/ATlOy9HYgLMAAAAC/push-ups.gif",
  "https://media1.tenor.com/m/2nEQqqxUb5wAAAAC/jumping-jacks-workout.gif", 
  "https://media1.tenor.com/m/swrtW4dXlYAAAAAC/lunge-exercise.gif",
  "https://media1.tenor.com/m/U7OXlvYxaTIAAAAC/squats.gif",
  "https://media1.tenor.com/m/ZC-WH4unx7YAAAAd/burpees-exercise.gif",
  "https://media1.tenor.com/m/gI-8qCUMSeMAAAAd/pushup.gif",
  "https://media1.tenor.com/m/0SO6-iX_RRYAAAAd/shoulder.gif",
  "https://media1.tenor.com/m/Jet8SkE99wYAAAAd/tricep.gif",
  "https://media1.tenor.com/m/K6_2KpT9MhQAAAAC/plank-exercise.gif",
  "https://media1.tenor.com/m/OF44QmJrRwkAAAAd/sit-ups.gif",
  // Add more machine-based exercise animations
  "https://media1.tenor.com/m/Kqmj7EdNpnAAAAAd/treadmill.gif",
  "https://media1.tenor.com/m/vXeUmbmvFpwAAAAC/workout-gym.gif", 
  "https://media1.tenor.com/m/jlG-oNo_Q5QAAAAC/rowing-machine-workout.gif",
  "https://media1.tenor.com/m/3UtJ9tbbM8EAAAAd/elliptical-cardio.gif",
  "https://media1.tenor.com/m/_dv3zE6PBToAAAAC/chest-press-workout.gif"
];

// Map common exercise keywords to animation indices
const exerciseKeywordMap: Record<string, number> = {
  'push': 0,
  'chest': 0,
  'push-up': 0,
  'pushup': 0,
  'jumping': 1,
  'jack': 1,
  'cardio': 1,
  'lunge': 2,
  'leg': 2,
  'squat': 3,
  'quad': 3,
  'burpee': 4,
  'hiit': 4,
  'diamond': 5,
  'push up': 5,
  'shoulder': 6,
  'delt': 6,
  'tricep': 7,
  'arm': 7,
  'plank': 8,
  'core': 8,
  'sit': 9,
  'ab': 9,
  'crunch': 9,
  // Add machine-based keywords
  'treadmill': 10,
  'run': 10,
  'stair': 10,
  'bike': 11,
  'cycle': 11,
  'stationary': 11,
  'row': 12,
  'rowing': 12,
  'elliptical': 13,
  'cross': 13,
  'machine': 14,
  'press': 14,
  'cable': 14
};

interface ExerciseInfo {
  name?: string;
  bodyPart?: string;
  target?: string;
  id?: string | number;
  displayPreference?: 'video' | 'photo' | 'auto';
  equipment?: string;
}

// Cache for exercise images to avoid repeated lookups
const exerciseImageCache: Record<string, string> = {};

// Function to query the MuscleWiki API
export const queryMuscleWikiApi = async (exerciseName: string): Promise<string | null> => {
  try {
    // First try to search by name
    const searchUrl = `${MUSCLEWIKI_API_BASE}/search?query=${encodeURIComponent(exerciseName)}`;
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`Failed to search MuscleWiki: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    if (searchData && searchData.length > 0) {
      const firstResult = searchData[0];
      // MuscleWiki API returns URL in the 'video' field for animated GIFs
      return firstResult.video || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error querying MuscleWiki API:', error);
    return null;
  }
};

/**
 * Gets the best animation URL for an exercise synchronously
 */
export const getBestExerciseImageUrlSync = (exercise: ExerciseInfo): string => {
  if (!exercise) return reliableAnimations[0];
  
  // If exercise already has a gifUrl that starts with https, use it
  if ('gifUrl' in exercise && typeof exercise.gifUrl === 'string' && 
      exercise.gifUrl.startsWith('https') && !exercise.gifUrl.includes('null')) {
    return exercise.gifUrl;
  }
  
  // If we have a cached image for this exercise, use it
  if (exercise.name && exerciseImageCache[exercise.name.toLowerCase()]) {
    return exerciseImageCache[exercise.name.toLowerCase()];
  }
  
  // Check for MuscleWiki image based on exercise name
  if (exercise.name) {
    const name = exercise.name.toLowerCase();
    
    // Check exact match in MuscleWiki
    if (muscleWikiImages[name]) {
      exerciseImageCache[name] = muscleWikiImages[name];
      return muscleWikiImages[name];
    }
    
    // Check partial match in MuscleWiki
    for (const [keyword, url] of Object.entries(muscleWikiImages)) {
      if (name.includes(keyword)) {
        exerciseImageCache[name] = url;
        return url;
      }
    }
    
    // Check in WorkoutLabs images
    if (workoutLabsImages[name]) {
      exerciseImageCache[name] = workoutLabsImages[name];
      return workoutLabsImages[name];
    }
    
    // Check partial match in WorkoutLabs
    for (const [keyword, url] of Object.entries(workoutLabsImages)) {
      if (name.includes(keyword)) {
        exerciseImageCache[name] = url;
        return url;
      }
    }
    
    // Use exercise name to find matching keywords for fallback animations
    for (const [keyword, index] of Object.entries(exerciseKeywordMap)) {
      if (name.includes(keyword)) {
        return reliableAnimations[index < reliableAnimations.length ? index : 0];
      }
    }
    
    // If no keyword matches, use first character of name to select an animation
    const firstChar = name.charAt(0);
    const index = firstChar.charCodeAt(0) % reliableAnimations.length;
    return reliableAnimations[index];
  }
  
  // If no name, try using equipment to determine if it's a machine exercise
  if (exercise.equipment) {
    const equipment = exercise.equipment.toLowerCase();
    if (equipment.includes('machine') || 
        equipment.includes('cable') || 
        equipment.includes('treadmill') ||
        equipment.includes('bike') ||
        equipment.includes('elliptical')) {
      // Select a machine-specific animation
      for (const [keyword, index] of Object.entries(exerciseKeywordMap)) {
        if (equipment.includes(keyword) && index >= 10) { // Indices 10+ are for machines
          return reliableAnimations[index < reliableAnimations.length ? index : 0];
        }
      }
    }
  }
  
  // If no name, try using bodyPart or target
  if (exercise.bodyPart) {
    const bodyPart = exercise.bodyPart.toLowerCase();
    for (const [keyword, index] of Object.entries(exerciseKeywordMap)) {
      if (bodyPart.includes(keyword)) {
        return reliableAnimations[index < reliableAnimations.length ? index : 0];
      }
    }
  }
  
  if (exercise.target) {
    const target = exercise.target.toLowerCase();
    for (const [keyword, index] of Object.entries(exerciseKeywordMap)) {
      if (target.includes(keyword)) {
        return reliableAnimations[index < reliableAnimations.length ? index : 0];
      }
    }
  }
  
  // Last resort: use ID to pick an animation
  if (exercise.id) {
    const idStr = String(exercise.id);
    const lastChar = idStr.charAt(idStr.length - 1);
    const index = parseInt(lastChar, 10) % reliableAnimations.length;
    return reliableAnimations[index >= 0 ? index : 0];
  }
  
  // Default fallback
  return reliableAnimations[0];
};

/**
 * Gets a YouTube video ID for an exercise if available
 */
export const getExerciseYoutubeId = (exercise: ExerciseInfo): string | undefined => {
  // Return undefined if display preference is explicitly set to photo
  if (exercise.displayPreference === 'photo') return undefined;

  if (!exercise || !exercise.name) return undefined;
  
  const name = exercise.name.toLowerCase();
  
  // Direct match
  if (exerciseYoutubeIDs[name]) {
    return exerciseYoutubeIDs[name];
  }
  
  // Partial match
  for (const [keyword, id] of Object.entries(exerciseYoutubeIDs)) {
    if (name.includes(keyword)) {
      return id;
    }
  }

  // Check if it's a machine exercise based on equipment
  if (exercise.equipment) {
    const equipment = exercise.equipment.toLowerCase();
    if (equipment.includes('machine') || 
        equipment.includes('cable') || 
        equipment.includes('treadmill') ||
        equipment.includes('bike') ||
        equipment.includes('elliptical')) {
      // Try to match based on equipment + exercise name
      for (const [keyword, id] of Object.entries(exerciseYoutubeIDs)) {
        if (equipment.includes(keyword)) {
          return id;
        }
      }
    }
  }
  
  return undefined;
};

/**
 * Searches for an exercise image across all available sources
 */
export const searchExerciseImage = async (exerciseName: string): Promise<string | null> => {
  if (!exerciseName) return null;
  
  const name = exerciseName.toLowerCase();
  
  // Check cache first
  if (exerciseImageCache[name]) {
    return exerciseImageCache[name];
  }
  
  // Check MuscleWiki
  if (muscleWikiImages[name]) {
    exerciseImageCache[name] = muscleWikiImages[name];
    return muscleWikiImages[name];
  }
  
  // Check partial matches in MuscleWiki
  for (const [keyword, url] of Object.entries(muscleWikiImages)) {
    if (name.includes(keyword)) {
      exerciseImageCache[name] = url;
      return url;
    }
  }
  
  // Try MuscleWiki API
  try {
    const muscleWikiUrl = await queryMuscleWikiApi(name);
    if (muscleWikiUrl) {
      exerciseImageCache[name] = muscleWikiUrl;
      return muscleWikiUrl;
    }
  } catch (error) {
    console.error('Error querying MuscleWiki API:', error);
  }
  
  // Check WorkoutLabs
  if (workoutLabsImages[name]) {
    exerciseImageCache[name] = workoutLabsImages[name];
    return workoutLabsImages[name];
  }
  
  // Check partial matches in WorkoutLabs
  for (const [keyword, url] of Object.entries(workoutLabsImages)) {
    if (name.includes(keyword)) {
      exerciseImageCache[name] = url;
      return url;
    }
  }
  
  // Use fallback animations as last resort
  for (const [keyword, index] of Object.entries(exerciseKeywordMap)) {
    if (name.includes(keyword)) {
      return reliableAnimations[index < reliableAnimations.length ? index : 0];
    }
  }
  
  // Default fallback
  const index = name.charAt(0).charCodeAt(0) % reliableAnimations.length;
  return reliableAnimations[index];
};

// Export the array for direct access
export const getReliableAnimations = () => reliableAnimations;

// Export YouTube IDs map for direct access
export const getExerciseYoutubeIDs = () => exerciseYoutubeIDs;

// Export MuscleWiki images map for direct access
export const getMuscleWikiImages = () => muscleWikiImages;

// Export WorkoutLabs images map for direct access
export const getWorkoutLabsImages = () => workoutLabsImages;
