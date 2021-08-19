import { createSlice } from '@reduxjs/toolkit'

export const estereoscopeosSlice = createSlice({
    name: 'estereosopeo',
    initialState: {
        estereoscopeos_data: []
    },

    reducers: {
        update_data: (state, action) => {    
            state.estereoscopeos_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_data } = estereoscopeosSlice.actions
export default estereoscopeosSlice.reducer