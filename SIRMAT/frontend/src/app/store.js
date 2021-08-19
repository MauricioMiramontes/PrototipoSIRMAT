import { configureStore } from '@reduxjs/toolkit'
import userSlice from './slices/user_data.js'
import camarasSlice from './slices/camarasSlice.js'
import trampasSlice from './slices/trampasSlice.js'
import estereoscopeosSlice from './slices/estereoscopeosSlice.js'

export default configureStore({ 
    // Esqueleto de la store
    reducer: {
        user : userSlice,
        camaras : camarasSlice,
        trampas : trampasSlice,
        estereoscopeos : estereoscopeosSlice,
    },
})