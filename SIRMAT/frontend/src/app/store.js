import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/user_data.js'
import camarasSlice from './slices/camarasSlice.js'
import trampasSlice from './slices/trampasSlice.js'
import estereoscopiosSlice from './slices/estereoscopiosSlice.js'
import especiesSlice from './slices/especiesSlice.js'

export default configureStore({ 
    // Esqueleto de la store
    reducer: {
        user : userSlice,
        camaras : camarasSlice,
        trampas : trampasSlice,
        estereoscopios : estereoscopiosSlice,
        especies : especiesSlice,
    },
})