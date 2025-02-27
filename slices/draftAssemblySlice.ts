import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../src/api';
import {Component} from './componentSlice'

export interface ComponentAssembly {
    component: Component;
    count: number;
}

export interface ComponentUpdate {
    count: number;
}

export interface AssemblyData {
    satelliteName: string | null;
    flyDate: string | null;
}

// Стейт для слайса
interface DraftAssemblyState {
    id: number | undefined;
    componentsCount: number | undefined;
    isDraft: boolean;
    componentsInAssembly: ComponentAssembly[];
    assemblyData: AssemblyData;
    error: string | null;
    status: string;
    loading: boolean;
}

// Начальное состояние
const initialState: DraftAssemblyState = {
    id: NaN,
    componentsCount: NaN,
    isDraft: false,
    componentsInAssembly: [],
    assemblyData: {
        satelliteName: '',
        flyDate: '',
    },
    status: '',
    error: null,
    loading: false,
};

// Типы для асинхронных действий
interface GetAssemblyResponse {
    id: number;
    satelliteName: string;
    flyDate: string;
    status: string;
    componentsCount: number;
    componentsInAssembly: ComponentAssembly[];
}

interface AddComponentInAssemblyResponse {
    component: Component;
    count: number;
}

// Асинхронные действия (Thunks)

export const getAssembly = createAsyncThunk<GetAssemblyResponse, string, { rejectValue: string }>(
    'assembly/getAssembly',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.assemblies.assembliesRead(id);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при получении данных.');
        }
    }
);

export const addComponentInAssembly = createAsyncThunk<AddComponentInAssemblyResponse, number, { rejectValue: string }>(
    'assembly/addComponentInAssembly',
    async (componentId, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsAddToDraftCreate(componentId.toString());
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при добавлении компонента.');
        }
    }
);

export const deleteAssembly = createAsyncThunk<void, string, { rejectValue: string }>(
    'assembly/deleteAssembly',
    async (id, { rejectWithValue }) => {
        try {
            await api.assemblies.assembliesDelete(id, {});
        } catch (error) {
            return rejectWithValue('Ошибка при удалении сборки.');
        }
    }
);

export const updateAssembly = createAsyncThunk<AssemblyData, { id: string; data: AssemblyData }, { rejectValue: string }>(
    'assembly/updateAssembly',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.assemblies.assembliesUpdate(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении сборки.');
        }
    }
);

export const updateComponentInAssembly = createAsyncThunk<ComponentAssembly, { id: string; data: ComponentUpdate }, { rejectValue: string }>(
    'assembly/updateComponentInAssembly',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsDraftUpdate(id, data);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении компонента в сборке.');
        }
    }
);

export const deleteComponentInAssembly = createAsyncThunk<void, { id: string }, { rejectValue: string }>(
    'assembly/deleteComponentInAssembly',
    async ({ id }, { rejectWithValue }) => {
        try {
            await api.components.componentsDraftDelete(id);
        } catch (error) {
            return rejectWithValue('Ошибка при удалении маршрута.');
        }
    }
);

export const submitAssembly = createAsyncThunk<void, { id: string }, { rejectValue: string }>(
    'assembly/submitAssembly',
    async ({ id }, { rejectWithValue }) => {
        try {
            await api.assemblies.assembliesFormCreate(id);
        } catch (error) {
            return rejectWithValue('Ошибка при формировании сборки.');
        }
    }
);

// Создание слайса
const assemblyDraftSlice = createSlice({
    name: 'assemblyDraftSlice',
    initialState,
    reducers: {
        setId(state, action: PayloadAction<number | undefined>) {
            state.id = action.payload;
        },
        setComponentCount(state, action: PayloadAction<number | undefined>) {
            state.componentsCount = action.payload;
        },
        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },
        setAssemblyData(state, action: PayloadAction<AssemblyData>) {
            state.assemblyData = { ...state.assemblyData, ...action.payload };
        },
        setComponentInAssembly(state, action: PayloadAction<{ component_id: string; count: number }>) {
            const { component_id, count } = action.payload;
            state.componentsInAssembly = state.componentsInAssembly.map((componentItem) => {
                if (componentItem.component.id === parseInt(component_id, 10)) {
                    return { ...componentItem, count };
                }
                return componentItem;
            });
        },
        setComponents(state, action: PayloadAction<ComponentAssembly[]>) {
            state.componentsInAssembly = action.payload;
        },
        resetId(state) {
            state.id = NaN;
        },
        resetComponentCount(state) {
            // @ts-ignore
            state.componentsCount = NaN;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssembly.fulfilled, (state: DraftAssemblyState, action) => {
                state.loading = false;
                const assembly = action.payload;
                state.componentsInAssembly = assembly.components;
                state.assemblyData.satelliteName = assembly.satelliteName;
                state.assemblyData.flyDate = assembly.flyDate;
                state.isDraft = assembly.status === 'draft';
                state.id = assembly.id;
                state.componentsCount = assembly.componentsCount;
            })
            .addCase(getAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при получении данных.';
            });

        builder
            .addCase(addComponentInAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addComponentInAssembly.fulfilled, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.componentsInAssembly.push(action.payload);
            })
            .addCase(addComponentInAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при добавлении поездки.';
            });

        builder
            .addCase(deleteAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAssembly.fulfilled, (state: DraftAssemblyState) => {
                state.loading = false;
                state.id = NaN;
                state.componentsCount = NaN;
                state.componentsInAssembly = [];
                state.assemblyData = { satelliteName: '', flyDate: ''};
            })
            .addCase(deleteAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при удалении поездки.';
            });

        builder
            .addCase(submitAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(submitAssembly.fulfilled, (state: DraftAssemblyState) => {
                state.loading = false;
                state.id = NaN;
                state.componentsCount = NaN;
                state.componentsInAssembly = [];
                state.assemblyData = { satelliteName: '', flyDate: ''};
            })
            .addCase(submitAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при формировании поездки.';
            });

        builder
            .addCase(updateAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateAssembly.fulfilled, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.assemblyData = action.payload;
            })
            .addCase(updateAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при обновлении сборки.';
            });

        builder
            .addCase(updateComponentInAssembly.pending, (state: DraftAssemblyState) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateComponentInAssembly.fulfilled, (state: DraftAssemblyState, action) => {
                state.loading = false;
                // @ts-ignore
                const { componentId, count} = action.payload;
                const component = state.componentsInAssembly.find((r) => r.component.id === componentId);
                if (component) {
                    component.count = count;
                }
            })
            .addCase(updateComponentInAssembly.rejected, (state: DraftAssemblyState, action) => {
                state.loading = false;
                state.error = action.payload || 'Ошибка при обновлении компонента.';
            });
    },
});

// Экспортируем действия и редюсер
export const {
    setId,
    setComponentCount,
    setError,
    setAssemblyData,
    setComponentInAssembly,
    setComponents,
    resetComponentCount,
    resetId,
} = assemblyDraftSlice.actions;

export default assemblyDraftSlice.reducer;