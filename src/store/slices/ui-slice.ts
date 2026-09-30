import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type UiState = {
  mobileNavOpen: boolean
  themeDockOpen: boolean
}

const initialState: UiState = { mobileNavOpen: false, themeDockOpen: false }

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMobileNav(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload
      if (action.payload) state.themeDockOpen = false
    },
    setThemeDock(state, action: PayloadAction<boolean>) {
      state.themeDockOpen = action.payload
      if (action.payload) state.mobileNavOpen = false
    },
  },
  selectors: {
    selectMobileNavOpen: (s) => s.mobileNavOpen,
    selectThemeDockOpen: (s) => s.themeDockOpen,
  },
})

export const { setMobileNav, setThemeDock } = uiSlice.actions
export const { selectMobileNavOpen, selectThemeDockOpen } = uiSlice.selectors
