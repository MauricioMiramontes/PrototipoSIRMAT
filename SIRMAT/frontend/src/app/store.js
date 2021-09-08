import { configureStore } from '@reduxjs/toolkit'

// Importes para que la store sea persistente
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import { persistReducer } from 'redux-persist'

// Slices de Redux para cada parte de los datos
import userSlice from './slices/user_data.js'
import camarasSlice from './slices/camarasSlice.js'
import trampasSlice from './slices/trampasSlice.js'
import estereoscopiosSlice from './slices/estereoscopiosSlice.js'
import especiesSlice from './slices/especiesSlice.js'
import detallesSlices from './slices/detallesSlices.js'

const reducers = combineReducers({
    user: userSlice,
    camaras: camarasSlice,
    trampas: trampasSlice,
    estereoscopios: estereoscopiosSlice,
    especies: especiesSlice,
    detalles : detallesSlices
});

const persistConfig = {
    key: 'root',
    storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default configureStore({
    // Esqueleto de la store
    reducer: persistedReducer
})