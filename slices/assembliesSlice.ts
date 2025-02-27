import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../src/api';
import { Assembly } from "../src/api/Api.ts";

// Интерфейс состояния слайса
interface AssembliesState {
    assemblies: Assembly[];
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: AssembliesState = {
    assemblies: [],
    loading: false,
    error: null,
};

// Асинхронное действие для получения списка сборок с фильтрами
export const getAssemblies = createAsyncThunk(
    'assemblies/getAssemblies',
    async (filters: { status?: string; start_date?: string; end_date?: string }) => {
        const response = await api.assemblies.assembliesList({ query: filters });
        return response.data;
    }
);

// Асинхронное действие для удаления сборки
export const deleteAssembly = createAsyncThunk(
    'assemblies/deleteAssembly',
    async (id: string) => {
        await api.assemblies.assembliesDelete(id);
        return id;
    }
);

// Асинхронное действие для завершения или отклонения сборки
export const moderateAssembly = createAsyncThunk(
    'assemblies/moderateAssembly',
    async ({ id, status }: { id: string; status: 'complete' | 'reject' }) => {
        await api.assemblies.assembliesModerateCreate(id, { status: status });
        return { id, status };
    }
);

const assembliesSlice = createSlice({
    name: 'assemblies',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAssemblies.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssemblies.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-ignore
                state.assemblies = action.payload;
            })
            .addCase(getAssemblies.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении сборок';
            })
            .addCase(deleteAssembly.fulfilled, (state, action) => {
                state.assemblies = state.assemblies.filter(
                    (assembly) => assembly.id !== parseInt(action.payload)
                );
            })
            .addCase(moderateAssembly.fulfilled, (state, action) => {
                state.assemblies = state.assemblies.map((assembly) =>
                    assembly.id === parseInt(action.payload.id)
                        ? { ...assembly, status: action.payload.status === "complete" ? "completed" : "rejected" }
                        : assembly
                );
            });
    },
});

export default assembliesSlice.reducer;
