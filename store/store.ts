import { configureStore } from '@reduxjs/toolkit';
import searchReducer from '../slices/searchSlice';
import userSlice from "../slices/userSlice.ts";
import componentsSlice from "../slices/componentSlice.ts";
import assembliesSlice from "../slices/assembliesSlice.ts";
import draftAssemblySlice from "../slices/draftAssemblySlice.ts";
import attributesSlice from "../slices/attributesSlice.ts";

const store = configureStore({
    reducer: {
        search: searchReducer,
        users: userSlice,
        components: componentsSlice,
        assemblies: assembliesSlice,
        draftAssembly: draftAssemblySlice,
        attributes: attributesSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;