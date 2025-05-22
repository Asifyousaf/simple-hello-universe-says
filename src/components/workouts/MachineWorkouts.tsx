
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import { getBestExerciseImageUrlSync } from '@/utils/exerciseImageUtils';

// Sample machine-based workouts
const machineWorkouts = [
  {
    id: 'machine-1',
    title: 'Cardio Machine Circuit',
    description: 'A complete cardio workout using various fitness machines',
    duration: 30,
    level: 'beginner',
    calories_burned: 350,
    exercises: [
      {
        name: 'Treadmill Run',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        instructions: ['Start with a 5-minute warm-up at a moderate pace', 'Increase speed for 30 seconds, then recover at moderate pace for 90 seconds', 'Repeat intervals 5 times', 'End with a 1-minute cooldown']
      },
      {
        name: 'Elliptical Trainer',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        instructions: ['Maintain a moderate resistance level', 'Focus on pushing and pulling with both arms and legs', 'Keep your core engaged throughout the movement', 'Try to maintain a steady rhythm']
      },
      {
        name: 'Stationary Bike',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        instructions: ['Start with moderate resistance', 'Increase resistance for 30 seconds, then decrease for 90 seconds of recovery', 'Repeat intervals 5 times', 'Maintain proper posture throughout']
      },
      {
        name: 'Rowing Machine',
        sets: 1,
        reps: 1,
        duration: 300,
        restTime: 60,
        instructions: ['Begin with proper form: legs bent, back straight, arms extended', 'Push with legs first, then pull with arms, finish by leaning back slightly', 'Return to starting position by extending arms, leaning forward, then bending knees', 'Maintain a steady rhythm and controlled breathing']
      }
    ]
  },
  {
    id: 'machine-2',
    title: 'Resistance Machine Full Body',
    description: 'Complete full body workout using weight machines',
    duration: 45,
    level: 'intermediate',
    calories_burned: 400,
    exercises: [
      {
        name: 'Leg Press',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        instructions: ['Adjust the seat so your knees are at 90 degrees when in starting position', 'Place feet shoulder-width apart on the platform', 'Push the platform away until legs are extended but not locked', 'Slowly return to starting position']
      },
      {
        name: 'Chest Press Machine',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        instructions: ['Adjust seat height so handles are at chest level', 'Grasp handles with a full grip', 'Push forward until arms are extended but not locked', 'Slowly return to starting position']
      },
      {
        name: 'Lat Pulldown',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        instructions: ['Adjust thigh pad for stability', 'Grasp the bar with hands wider than shoulder width', 'Pull the bar down to chest level while keeping back straight', 'Slowly return to starting position with controlled movement']
      },
      {
        name: 'Seated Cable Row',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        instructions: ['Sit with knees slightly bent, grasp cable attachment', 'Keep back straight and pull the handle toward your lower abdomen', 'Squeeze shoulder blades together at the end of the movement', 'Slowly extend arms back to starting position']
      },
      {
        name: 'Leg Extension',
        sets: 3,
        reps: 12,
        duration: 60,
        restTime: 90,
        instructions: ['Sit on the machine with back against pad', 'Adjust the pad so it rests on top of your lower shin', 'Extend legs until knees are straight but not locked', 'Slowly lower weight back to starting position']
      }
    ]
  },
  {
    id: 'machine-3',
    title: 'Cable Machine Workout',
    description: 'Multi-joint functional exercises using cable machines',
    duration: 40,
    level: 'advanced',
    calories_burned: 450,
    exercises: [
      {
        name: 'Cable Chest Fly',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        instructions: ['Stand in the center of the cable machine with feet shoulder-width apart', 'Hold cable handles with arms extended to sides', 'Bring handles together in front of chest with a slight bend in elbows', 'Slowly return to starting position']
      },
      {
        name: 'Cable Tricep Pushdown',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        instructions: ['Stand facing the cable machine with feet shoulder-width apart', 'Grasp the rope attachment with palms facing each other', 'Keep elbows close to body and push down until arms are fully extended', 'Slowly return to starting position']
      },
      {
        name: 'Cable Bicep Curl',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        instructions: ['Stand facing the cable machine with feet shoulder-width apart', 'Grasp the handle with palms facing up', 'Keep elbows close to sides and curl up toward chest', 'Slowly lower to starting position']
      },
      {
        name: 'Cable Pull Through',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        instructions: ['Stand facing away from the cable machine with feet shoulder-width apart', 'Bend forward and grasp the rope attachment between legs', 'Keeping back straight, thrust hips forward until standing upright', 'Slowly return to starting position']
      },
      {
        name: 'Cable Wood Chop',
        sets: 3,
        reps: 15,
        duration: 60,
        restTime: 60,
        instructions: ['Stand with side to the cable machine', 'Grasp handle with both hands above shoulder', 'Pull diagonally across body toward opposite knee', 'Control the return to starting position', 'Complete all reps, then switch sides']
      }
    ]
  }
];

interface MachineWorkoutsProps {
  onStartWorkout: (workout: any) => void;
}

const MachineWorkouts: React.FC<MachineWorkoutsProps> = ({ onStartWorkout }) => {
  // Prepare workouts with image URLs
  const workoutsWithImages = machineWorkouts.map(workout => {
    // Get first exercise for thumbnail
    const firstExercise = workout.exercises[0];
    
    return {
      ...workout,
      image: getBestExerciseImageUrlSync(firstExercise)
    };
  });
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Machine-Based Workouts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {workoutsWithImages.map((workout) => (
          <Card key={workout.id} className="overflow-hidden h-full flex flex-col">
            <div className="h-48 overflow-hidden bg-gray-100">
              <img 
                src={workout.image} 
                alt={`${workout.title} thumbnail`} 
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  e.currentTarget.src = 'https://musclewiki.com/media/uploads/male-cardio-treadmill-run-side.gif';
                }}
              />
            </div>
            <CardHeader>
              <CardTitle>{workout.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600 mb-3">{workout.description}</p>
              <div className="flex justify-between text-sm text-gray-500 mb-3">
                <span>{workout.level.charAt(0).toUpperCase() + workout.level.slice(1)}</span>
                <span>{workout.duration} min</span>
                <span>{workout.calories_burned} cal</span>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Equipment:</h4>
                <ul className="text-sm text-gray-600">
                  {Array.from(new Set(workout.exercises.map(e => e.name.split(' ')[0]))).map((equipment, i) => (
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
    </div>
  );
};

export default MachineWorkouts;
