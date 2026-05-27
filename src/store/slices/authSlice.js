import { createSlice } from '@reduxjs/toolkit';

const savedSettings = localStorage.getItem('system_settings');
const initialState = {
  user: null,
  role: 'student', // 'admin' or 'student'
  loading: false,
  settings: savedSettings ? JSON.parse(savedSettings) : {
    systemName: 'ATLAS PRO',
    pixCode: '00020101021126580014br.gov.bcb.pix01369c3a382c-4cfc-43f1-a1e6-42bb53c65c695204000053039865406150.005802BR5913AtlasProSaaS6009BeloHoriz62070503***63041A2D',
    contactPhone: '5531991660594',
    themeColor: '#000000'
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setSettings: (state, action) => {
      state.settings = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = 'student';
    },
  },
});

export const { setUser, setRole, setSettings, logout } = authSlice.actions;
export default authSlice.reducer;
