
import React, { useEffect, useState } from 'react';
import { Play, Pause, Video, Image, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import ExerciseDemonstration from './ExerciseDemonstration';
import ExerciseInstructions from './ExerciseInstructions';
import TimerDisplay from './TimerDisplay';
import { getBestExerciseImageUrlSync } from '@/utils/exerciseImageUtils';
import { useToast } from "@/hooks/use-toast";
import { Exercise } from '@/types/workout';

interface WorkoutExerciseViewProps {
  exercise: any;
  currentSet: number;
  totalSets: number;
  remainingSeconds: number;
  isRest: boolean;
  isPaused: boolean;
  onTogglePause: () => void;
  onComplete: () => void;
  nextExercises?: Exercise[]; // Add next exercises prop
}

// Rest time image URL - high quality image of someone taking a break
const REST_TIME_IMAGE = "https://images.unsplash.com/photo-1582562124811-c09040d0a901";

const WorkoutExerciseView: React.FC<WorkoutExerciseViewProps> = ({
  exercise,
  currentSet,
  totalSets,
  remainingSeconds,
  isRest,
  isPaused,
  onTogglePause,
  onComplete,
  nextExercises = [] // Default to empty array
}) => {
  const { toast } = useToast();
  const [backupImage, setBackupImage] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [displayMode, setDisplayMode] = useState<'video' | 'photo'>(
    exercise.displayPreference === 'video' || 
    (exercise.youtubeId && exercise.displayPreference !== 'photo') ? 'video' : 'photo'
  );
  
  // Make sure we have a valid image URL
  const imageUrl = isRest ? 
    REST_TIME_IMAGE : 
    exercise.gifUrl || getBestExerciseImageUrlSync(exercise);
  
  // Get YouTube video ID for the exercise if available
  const youtubeId = !isRest && exercise.youtubeId ? exercise.youtubeId : undefined;
  
  // Try to fetch a backup image if needed
  useEffect(() => {
    if (!isRest && exercise.name && displayMode === 'photo' && imageLoadFailed && !backupImage) {
      // Try to get backup image
      const getBackupImage = async () => {
        const image = await searchExerciseImage(exercise.name);
        if (image) {
          setBackupImage(image);
          console.log('Backup image found for:', exercise.name);
        }
      };
      
      getBackupImage();
    }
  }, [exercise.name, displayMode, backupImage, imageLoadFailed, isRest]);

  // Placeholder for searchExerciseImage function
  const searchExerciseImage = async (exerciseName: string): Promise<string | null> => {
    // Implementation would be moved from exerciseImageUtils.ts
    return null;
  };
  
  // Toggle display mode between video and photo
  const toggleDisplayMode = () => {
    if (!youtubeId) {
      toast({
        title: "No video available",
        description: "Sorry, this exercise doesn't have a video demonstration"
      });
      return;
    }
    
    const newMode = displayMode === 'video' ? 'photo' : 'video';
    setDisplayMode(newMode);
    
    // Show notification of mode change
    toast({
      title: `Switched to ${newMode} mode`,
      description: newMode === 'video' ? 
        'Showing video demonstration' : 
        'Showing photo demonstration'
    });
  };
  
  // Generate exercise instructions if they don't exist
  const getInstructions = () => {
    if (exercise.instructions && Array.isArray(exercise.instructions)) {
      return exercise.instructions;
    }
    
    // Default instructions based on exercise type/name
    const defaultInstructions = [];
    const name = exercise.name ? exercise.name.toLowerCase() : '';
    
    // Add instructions based on exercise name
    if (name.includes('push')) {
      defaultInstructions.push('Get into a plank position with arms straight');
      defaultInstructions.push('Lower your body by bending your elbows');
      defaultInstructions.push('Push back up to the starting position');
      defaultInstructions.push('Keep your core tight throughout the movement');
    } else if (name.includes('squat')) {
      defaultInstructions.push('Stand with feet shoulder-width apart');
      defaultInstructions.push('Lower your body by bending your knees and pushing hips back');
      defaultInstructions.push('Keep your chest up and back straight');
      defaultInstructions.push('Return to starting position by extending your knees and hips');
    } else if (name.includes('lunge')) {
      defaultInstructions.push('Step forward with one leg');
      defaultInstructions.push('Lower your body until both knees are bent at 90 degrees');
      defaultInstructions.push('Push back up to starting position');
      defaultInstructions.push('Repeat with the other leg');
    } 
    // Add machine-specific instructions
    else if (exercise.isMachineExercise || (exercise.equipment && exercise.equipment.toLowerCase().includes('machine'))) {
      if (name.includes('treadmill') || name.includes('run') || name.includes('jog')) {
        defaultInstructions.push('Start at a comfortable warm-up pace');
        defaultInstructions.push('Gradually increase speed to your target intensity');
        defaultInstructions.push('Maintain proper posture with shoulders back and core engaged');
        defaultInstructions.push('Complete your workout duration, then gradually reduce speed for cooldown');
      } else if (name.includes('bike') || name.includes('cycle')) {
        defaultInstructions.push('Adjust the seat height so your legs are slightly bent at the bottom of the pedal stroke');
        defaultInstructions.push('Start pedaling at a moderate resistance');
        defaultInstructions.push('Keep your core engaged and maintain good posture');
        defaultInstructions.push('Increase resistance for intervals as needed');
      } else if (name.includes('elliptical')) {
        defaultInstructions.push('Step onto the machine and grab the handles');
        defaultInstructions.push('Start moving your feet and arms in a coordinated motion');
        defaultInstructions.push('Maintain an upright posture with core engaged');
        defaultInstructions.push('Adjust resistance to achieve desired intensity');
      } else if (name.includes('row') || name.includes('rowing')) {
        defaultInstructions.push('Sit on the seat with feet secured on the footplates');
        defaultInstructions.push('Grab the handle with an overhand grip, arms extended');
        defaultInstructions.push('Push with legs first, then pull with back, finally arms');
        defaultInstructions.push('Return to starting position: arms first, then torso, finally legs');
      } else if (name.includes('cable')) {
        defaultInstructions.push('Adjust the cable to the appropriate height');
        defaultInstructions.push('Select the proper attachment for the exercise');
        defaultInstructions.push('Maintain proper form throughout the movement');
        defaultInstructions.push('Control the weight in both directions');
      } else {
        defaultInstructions.push('Adjust the machine to fit your body proportions');
        defaultInstructions.push('Start with a lighter weight to master proper form');
        defaultInstructions.push('Perform the exercise with controlled movement');
        defaultInstructions.push('Complete all repetitions with proper breathing technique');
      }
    } else {
      defaultInstructions.push('Perform the exercise with controlled movement');
      defaultInstructions.push('Maintain proper form throughout');
      defaultInstructions.push('Breathe consistently during the exercise');
      defaultInstructions.push('Complete all repetitions for each set');
    }
    
    return defaultInstructions;
  };

  const handleImageError = () => {
    console.log('Image error occurred for:', exercise.name);
    setImageLoadFailed(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-4">
        <div className="md:col-span-7 space-y-6">
          <div className="rounded-lg overflow-hidden shadow-sm">
            <div className="relative">
              <ExerciseDemonstration
                exerciseName={isRest ? 'Rest Time' : exercise.name}
                imageUrl={isRest ? REST_TIME_IMAGE : (backupImage || imageUrl)}
                currentSet={currentSet}
                totalSets={totalSets}
                isLoading={false}
                youtubeId={!isRest && displayMode === 'video' ? youtubeId : undefined}
                onImageError={handleImageError}
              />
              
              {/* Display mode toggle button - Only show for exercises, not rest */}
              {!isRest && (
                <div className="absolute top-2 right-2">
                  <Button 
                    onClick={toggleDisplayMode} 
                    size="sm" 
                    variant="secondary"
                    className="bg-white/80 backdrop-blur-sm hover:bg-white"
                  >
                    {displayMode === 'photo' ? (
                      <>
                        <Video className="h-4 w-4 mr-1" />
                        {youtubeId ? 'Video' : 'No Video'}
                      </>
                    ) : (
                      <>
                        <Image className="h-4 w-4 mr-1" />
                        Photo
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <ExerciseInstructions instructions={getInstructions()} />
          </div>
          
          {/* New section: Coming up next */}
          {nextExercises && nextExercises.length > 0 && (
            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <ChevronRight className="mr-2 text-purple-600" />
                Coming Up Next
              </h3>
              <div className="space-y-3">
                {nextExercises.slice(0, 2).map((nextExercise, index) => (
                  <div key={index} className="flex items-center border-b border-gray-100 pb-2 last:border-0">
                    <div className="h-10 w-10 bg-gray-100 rounded-md overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={getBestExerciseImageUrlSync(nextExercise)} 
                        alt={nextExercise.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-sm">{nextExercise.name}</p>
                      <p className="text-xs text-gray-500">
                        {nextExercise.sets} sets × {nextExercise.reps} reps
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="md:col-span-5">
          <div className="bg-gray-50 p-5 rounded-lg flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xl font-bold mb-1">{isRest ? 'Rest Time' : exercise.name}</h3>
              <p className="text-gray-600 mb-4">
                {isRest ? 
                  'Take a short break before the next set' : 
                  (exercise.isMachineExercise ? 
                    `Duration: ${exercise.duration || 60} seconds` : 
                    `${exercise.reps || 10} reps × ${totalSets} sets`)
                }
              </p>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">
                    {isRest ? 'Rest Time Remaining' : 'Exercise Time Remaining'}
                  </span>
                  <span className="text-sm font-medium">
                    Set {currentSet} of {totalSets}
                  </span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={(remainingSeconds / (isRest ? 60 : (exercise.duration || 60))) * 100} 
                    className="h-2"
                  />
                </div>
              </div>
              
              <div className="flex justify-center my-8">
                <TimerDisplay 
                  timeLeft={remainingSeconds}
                  isPaused={isPaused}
                  isRest={isRest}
                  animate={remainingSeconds < 10}
                  onTimeEnd={onComplete}
                />
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button
                onClick={onTogglePause}
                variant="outline"
                className="flex-1 mr-2"
              >
                {isPaused ? (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </Button>
              
              <Button
                onClick={onComplete}
                variant="default"
                className="flex-1 ml-2 bg-purple-600 hover:bg-purple-700"
              >
                {isRest ? 'Skip Rest' : `Complete ${isRest ? 'Rest' : 'Set'}`}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutExerciseView;
