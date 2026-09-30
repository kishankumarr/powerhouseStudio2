import { combineSlices, configureStore } from '@reduxjs/toolkit'
import { listenerMiddleware } from './listeners'
import { preferencesSlice } from './slices/preferences-slice'
import { uiSlice } from './slices/ui-slice'

const rootReducer = combineSlices(preferencesSlice, uiSlice)
export type RootState = ReturnType<typeof rootReducer>

/** Always create per request/mount; a module-level store would leak across server requests. */
export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (gDM) => gDM().prepend(listenerMiddleware.middleware),
  })

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
