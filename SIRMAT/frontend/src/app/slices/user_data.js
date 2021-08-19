import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        user_data: "Hola desde la cajita"
    },

    reducers: {
        update_data: (state, action) => {    
            state.user_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_data } = userSlice.actions
export default userSlice.reducer