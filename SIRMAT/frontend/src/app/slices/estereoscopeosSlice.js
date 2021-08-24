import { createSlice } from '@reduxjs/toolkit'

export const estereoscopeosSlice = createSlice({
    name: 'estereosopeos',
    initialState: {
        estereoscopeos_data: []
    },

    reducers: {
        update_estereoscopeos_data: (state, action) => {    
            state.estereoscopeos_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_estereoscopeos_data } = estereoscopeosSlice.actions
export default estereoscopeosSlice.reducer