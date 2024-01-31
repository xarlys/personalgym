export type IHistoryDTO = {
  id: string,
  exercise_id: string,
  hour: string,
  repetitions: number,
  series: number,
  user_client_id: string,
  created_at: string,
  exercise:{
    id: string,
    description: string,
    muscle_group_id:string,
    name: string,
    user_client_id: string,
    user_who_created_id: string,
    muscle_group:{
        id:string,
        name: string,
     },   
  },
}

// export type IHistoryDTO = {
//   id: string;
//   name: string;
//   group: string;
//   hour: string;
//   created_at: string;
// }
// export type IHistoryDTO = {
//   title?: string;
//   data: {
//     id: string;
//     hour: string;
//     series: number;
//     repetitions: number;
//     exercise_id: string;
//     user_client_id: string;
//     exercise: {
//         id: string;
//         user_client_id: string;
//         name: string;
//         description: string;
//         muscle_group_id: string;
//         user_who_created_id: string;
//         muscle_group: {
//             id: string,
//             name: string,
//         };
//     };
//     created_at: Date;
//   }[];
// }; 