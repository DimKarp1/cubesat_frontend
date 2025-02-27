
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../src/api';
import {resetComponentCount, resetId, setComponentCount, setId} from "./draftAssemblySlice.ts";
import {ApolloClient, InMemoryCache} from "@apollo/client";
import {CREATE_COMPONENT, FETCH_COMPONENT} from "../src/api/graphql.ts";
import {http, host} from "../src/api";

export const client = new ApolloClient({
    uri: http ? `http://${host}:8000/graphql/` : `https://${host}:8000/graphql/`,
    cache: new InMemoryCache()
});

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
    async (componentId, { rejectWithValue }) => {
        try {
            const { data } = await client.query({
                query: FETCH_COMPONENT,
                variables: { id: Number(componentId) }
            });
            console.log(data.component);
            return data.component;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных компонента');
        }
    }
);

export const updateComponent = createAsyncThunk<
    Component,
    { componentId: number; updatedData: Partial<Component> },
    { rejectValue: string }
>(
    'components/updateComponent',
    async ({ componentId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsUpdate(componentId, updatedData);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка обновления данных компонента');
        }
    }
);

// @ts-ignore
export const deleteComponent = createAsyncThunk<
    { componentId: number },
    { rejectValue: string }
>(
    'components/deleteComponent',
    async ({ componentId }, { rejectWithValue }) => {
        try {
            await api.components.componentsDelete(componentId);
            return { componentId };
        } catch (error) {
            return rejectWithValue('Ошибка удаления компонента');
        }
    }
);

export const addPicInComponent = createAsyncThunk<
    { componentId: number; imgSrc: string },
    { componentId: number; dataPic: FormData },
    { rejectValue: string }
>(
    'components/addPicInComponent',
    async ({ componentId, dataPic }, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsImageCreate(componentId, dataPic);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка добавления картинки');
        }
    }
);

export const createComponent = createAsyncThunk<
    Component,
    { title: string; shortDescription?: string; description?: string; price: number },
    { rejectValue: string }
>(
    'components/createComponent',
    async ({ title, shortDescription, description, price }, { rejectWithValue }) => {
        try {
            const { data } = await client.mutate({
                mutation: CREATE_COMPONENT,
                variables: { title, shortDescription, description, price }
            });
            return data.createComponent.component;
        } catch (error) {
            return rejectWithValue('Ошибка добавления компонента');
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