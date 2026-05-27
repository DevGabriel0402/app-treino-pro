import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [],
  loading: false,
};

const exerciseSlice = createSlice({
  name: 'exercises',
  initialState,
  reducers: {
    setExercises: (state, action) => {
      state.list = action.payload;
    },
    addExercise: (state, action) => {
      state.list.push(action.payload);
    },
  },
});

export const { setExercises, addExercise } = exerciseSlice.actions;
export default exerciseSlice.reducer;
