import { createSlice } from '@reduxjs/toolkit'

export const camarasSlice = createSlice({
    name: 'camaras',
    initialState: {
        camaras_data: []
    },

    reducers: {
        update_data: (state, action) => {    
            state.user_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_data } = camarasSlice.actions
export default camarasSlice.reducer