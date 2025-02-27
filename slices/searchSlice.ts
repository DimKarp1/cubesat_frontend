import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
    searchCubeSatTerm: string;
}

const initialState: SearchState = {
    searchCubeSatTerm: '',
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchCubeSatTerm(state, action: PayloadAction<string>) {
            state.searchCubeSatTerm = action.payload;
        },
        resetFilters(state) {
            state.searchCubeSatTerm = '';
        },
    },
});

export const { setSearchCubeSatTerm,resetFilters } = searchSlice.actions;

export default searchSlice.reducer;