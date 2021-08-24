import { createSlice } from '@reduxjs/toolkit'

export const estereoscopiosSlice = createSlice({
    name: 'estereosopeos',
    initialState: {
        estereoscopios_data: []
    },

    reducers: {
        update_estereoscopios_data: (state, action) => {    
            state.estereoscopios_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_estereoscopios_data } = estereoscopiosSlice.actions
export default estereoscopiosSlice.reducer