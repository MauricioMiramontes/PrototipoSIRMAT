import { createSlice } from '@reduxjs/toolkit'

export const especiesSlice = createSlice({
    name: 'especies',
    initialState: {
        especies_data: []
    },

    reducers: {
        update_especies_data: (state, action) => {    
            state.especies_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_especies_data } = especiesSlice.actions
export default especiesSlice.reducer