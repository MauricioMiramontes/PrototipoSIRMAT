import { createSlice } from '@reduxjs/toolkit'

export const detallesSlice = createSlice({
    name: 'detalles',
    initialState: {
        detalles_data: []
    },

    reducers: {
        update_detalles_data: (state, action) => {    
            state.detalles_data = action.payload
        },
    },
})
// Action creators are generated for each case reducer function
export const { update_detalles_data } = detallesSlice.actions
export default detallesSlice.reducer