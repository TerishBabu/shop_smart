import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, User } from '../../types';

const initialState: ProfileState = {
    user: {
        name: '',
        email: '',
        avatar: undefined,
    },
    uploading: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            state.user = { ...state.user, ...action.payload };
        },
        setUploading: (state, action: PayloadAction<boolean>) => {
            state.uploading = action.payload;
        },
        setAvatar: (state, action: PayloadAction<string>) => {
            state.user.avatar = action.payload;
        },
    },
});

export const { updateUser, setUploading, setAvatar } = profileSlice.actions;
export default profileSlice.reducer;