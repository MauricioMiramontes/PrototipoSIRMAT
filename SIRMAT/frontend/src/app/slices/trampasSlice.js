import { createSlice } from '@reduxjs/toolkit'

export const trampasSlice = createSlice({
    name: 'trampas',
    initialState: {
        trampas_data: []
    },

    reducers: {
        update_data: (state, action) => {    
            state.trampas_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_data } = trampasSlice.actions
export default trampasSlice.reducer