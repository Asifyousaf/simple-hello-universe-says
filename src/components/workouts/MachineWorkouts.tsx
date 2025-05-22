
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from 'lucide-react';
import { getBestExerciseImageUrlSync, getExerciseYoutubeId } from '@/utils/exerciseImageUtils';
import { fetchExercisesFromWger, transformWgerExercise } from '@/services/wgerApiService';
import { Exercise } from '@/types/exercise';
import { WorkoutData } from '@/types/workout';

// Import predefined workouts and templates from machineWorkoutData
import { predefinedMachineWorkouts, dynamicMachineWorkoutTemplates } from './machineWorkoutData';

interface MachineWorkoutsProps {
  onStartWorkout: (workout: WorkoutData) => void;
}

const MachineWorkouts: React.FC<MachineWorkoutsProps> = ({ onStartWorkout }) => {
  const [workouts, setWorkouts] = useState<WorkoutData[]>(predefinedMachineWorkouts.map(workout => ({
    ...workout,
    type: 'machine' // Ensure all predefined workouts have the type property
  })) as WorkoutData[]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // Fetch machine exercises from API and create workouts
  useEffect(() => {
    const fetchMachineExercises = async () => {
      try {
        setIsLoading(true);
        setLoadingError(null);
        
        // Fetch a larger set of exercises to filter through
        const exercises = await fetchExercisesFromWger(2, 100);
        
        if (!exercises || exercises.length === 0) {
          console.log('No exercises found from API');
          setLoadingError('No exercises found from the API');
          setIsLoading(false);
          return;
        }
        
        // Transform and filter for machine exercises
        const machineExercises = exercises
          .map(transformWgerExercise)
          .filter((ex: Exercise) => ex.isMachineExercise);
        
        if (machineExercises.length === 0) {
          console.log('No machine exercises found');
          // Don't set an error here, we'll just use predefined workouts
          setIsLoading(false);
          return;
        }
        
        console.log('Found machine exercises:', machineExercises.length);
        
        // Create workouts based on templates
        const apiWorkouts = dynamicMachineWorkoutTemplates.map(template => {
          // Filter exercises based on template criteria
          const filteredExercises = machineExercises.filter((ex: Exercise) => {
            const matchesEquipment = template.equipmentKeywords.some(keyword => 
              ex.equipment?.toLowerCase().includes(keyword) || 
              ex.machineType?.toLowerCase().includes(keyword)
            );
            
            const matchesBodyPart = template.bodyPartKeywords.some(keyword =>
              ex.bodyPart?.toLowerCase().includes(keyword) ||
              ex.target?.toLowerCase().includes(keyword)
            );
            
            return matchesEquipment && matchesBodyPart;
          });
          
          // Take a subset of exercises up to maxExercises and add YouTube IDs
          const workoutExercises = filteredExercises
            .slice(0, template.maxExercises)
            .map((ex: Exercise) => {
              // Ensure each exercise has a YouTube ID
              const youtubeId = ex.youtubeId || getExerciseYoutubeId({
                name: ex.name,
                equipment: ex.equipment,
                bodyPart: ex.bodyPart,
                target: ex.target
              });
              
              return {
                ...ex,
                sets: 3,
                reps: 12,
                duration: ex.duration || 60,
                restTime: ex.restTime || 60,
                youtubeId: youtubeId
              };
            });
          
          // If we don't have enough exercises, skip this template
          if (workoutExercises.length < 3) {
            return null; // Skip this template as we don't have enough exercises
          }
          
          return {
            ...template,
            exercises: workoutExercises,
            image: getBestExerciseImageUrlSync(workoutExercises[0]),
            type: 'machine' // Ensure type property is added
          };
        }).filter(Boolean) as unknown as WorkoutData[]; // Filter out nulls and cast to WorkoutData[]
        
        // Combine with predefined workouts - ensure all have proper type
        if (apiWorkouts && apiWorkouts.length > 0) {
          const predefinedWithType = predefinedMachineWorkouts.map(workout => ({
            ...workout,
            type: 'machine'
          })) as WorkoutData[];
          
          setWorkouts([...predefinedWithType, ...apiWorkouts]);
        }
      } catch (error) {
        console.error('Error fetching machine exercises:', error);
        setLoadingError('Failed to load machine workouts. Using default workouts instead.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMachineExercises();
  }, []);
  
  // Prepare workouts with images and ensure they all have YouTube IDs
  const workoutsWithImages = workouts.map(workout => {
    // Ensure all exercises have YouTube IDs
    if (workout.exercises && Array.isArray(workout.exercises)) {
      const updatedExercises = workout.exercises.map(exercise => {
        if (!exercise.youtubeId) {
          // Try to get a YouTube ID for this exercise
          const youtubeId = getExerciseYoutubeId({
            name: exercise.name,
            equipment: exercise.equipment,
            bodyPart: exercise.bodyPart,
            target: exercise.target
          });
          
          return {
            ...exercise,
            youtubeId: youtubeId || undefined
          };
        }
        return exercise;
      });
      
      workout = {
        ...workout,
        exercises: updatedExercises
      };
    }
    
    // Get first exercise for thumbnail if not already set
    if (!workout.image && workout.exercises && Array.isArray(workout.exercises) && workout.exercises.length > 0) {
      const firstExercise = workout.exercises[0];
      return {
        ...workout,
        type: workout.type || 'machine', // Ensure type property is set
        image: getBestExerciseImageUrlSync(firstExercise)
      };
    }
    return {
      ...workout,
      type: workout.type || 'machine' // Ensure type property is set
    };
  });
  
  return (
    <div className="space-y-4">
      {loadingError && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">{loadingError}</p>
        </div>
      )}
      
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-8 w-8 text-purple-600 animate-spin mr-2" />
          <p>Loading machine workouts...</p>
        </div>
      ) : workoutsWithImages.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workoutsWithImages.map((workout) => (
            <Card key={workout.id} className="overflow-hidden h-full flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img 
                  src={workout.image || 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif'} 
                  alt={`${workout.title} thumbnail`} 
                  className="w-full h-full object-cover object-center"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif';
                  }}
                />
              </div>
              <CardHeader>
                <CardTitle>{workout.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-600 mb-3">{workout.description}</p>
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                  <span>{workout.level?.charAt(0).toUpperCase() + workout.level?.slice(1) || 'Beginner'}</span>
                  <span>{workout.duration} min</span>
                  <span>{workout.calories_burned} cal</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">Equipment:</h4>
                  <ul className="text-sm text-gray-600">
                    {Array.isArray(workout.exercises) && Array.from(new Set(workout.exercises.map((e: any) => 
                      e.machineType || e.equipment || e.name.split(' ')[0]))).map((equipment: string, i: number) => (
                      <li key={i}>• {equipment}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => onStartWorkout(workout)}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  Start Workout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p>No machine workouts available. Please try again later.</p>
        </div>
      )}
    </div>
  );
};

export default MachineWorkouts;
