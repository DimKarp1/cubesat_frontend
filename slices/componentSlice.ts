import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../src/api';
import {resetComponentCount, resetId, setComponentCount, setId} from "./draftAssemblySlice.ts";


export interface Component {
    id: number;
    title: string;
    shortDescription: string;
    description: string;
    price: number;
    is_active: boolean;
    imgSrc: string;
}


interface ComponentsState {
    searchComponentTerm: string;
    components: Component[];
    selectedComponent: Component | null;

    loading: boolean;
    error: string | null;
}

const initialState: ComponentsState = {
    searchComponentTerm: '',
    components: [],
    selectedComponent: null,

    loading: false,
    error: null,
};


export const getComponentsList = createAsyncThunk<
    { components: Component[] },
    void,
    { rejectValue: string }
>(
    'components/getComponentsList',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const { components }: { components: ComponentsState } = getState();
        try {
            const response = await api.components.componentsList({component_name: components.searchComponentTerm});
            console.log(response.data.assemblyDraft);
            console.log(response.data.componentsInAssembly);
            if (response.data.assemblyDraft != 0) {
                const  id = response.data.assemblyDraft;
                const components = response.data.componentsInAssembly
                dispatch(setId(id));
                dispatch(setComponentCount(components));
                return response.data;
            } else {
                dispatch(resetId());
                dispatch(resetComponentCount());
            }
            return response.data;
        } catch (error) {
            console.error('Error fetching routes:', error);
            return rejectWithValue('Ошибка при загрузке данных');
        }
    }
);

export const getComponentDetails = createAsyncThunk<
    Component,
    number,
    { rejectValue: string }
>(
    'component/getComponentDetails',
    async (routeId, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsRead(routeId, {});
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных маршрута');
        }
    }
);


const componentsSlice = createSlice({
    name: 'components',
    initialState,
    reducers: {
        setSearchComponentTerm(state, action: PayloadAction<string>) {
            state.searchComponentTerm = action.payload;
        },
        resetFilters(state) {
            state.searchComponentTerm = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getComponentsList.pending, (state:ComponentsState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComponentsList.fulfilled, (state:ComponentsState, action) => {
                state.loading = false;
                state.components = action.payload.components;
            })
            .addCase(getComponentsList.rejected, (state:ComponentsState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Произошла ошибка';
            })
            .addCase(getComponentDetails.pending, (state:ComponentsState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getComponentDetails.fulfilled, (state:ComponentsState, action) => {
                state.loading = false;
                state.selectedComponent = action.payload;
            })
            .addCase(getComponentDetails.rejected, (state:ComponentsState, action) => {
                state.loading = false;
                state.error = action.error.message || 'Произошла ошибка';
            })
    },
});

export const { setSearchComponentTerm, resetFilters } = componentsSlice.actions;
export default componentsSlice.reducer;