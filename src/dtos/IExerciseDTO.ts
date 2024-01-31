export type IExerciseDTO = {
  id: string;
  name: string;
  description?: string;
  image?: string;
  thumbnail?: string;
  series?: number;
  repetitions?: number;
  muscle_group_id: string;
  user_client_id: string;
  user_who_created_id: string;
  created_at?: Date;
  updated_at?: Date;
  muscle_group?: {
    id: string;
    name: string;
  };
}