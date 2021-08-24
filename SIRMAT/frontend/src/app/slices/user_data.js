import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user_data: {
            data : []
        }
    },

    reducers: {
        update_user_data: (state, action) => {    
            state.user_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_user_data } = userSlice.actions
export default userSlice.reducer