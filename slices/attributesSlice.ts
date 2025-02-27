import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import { api } from "../src/api";
import {Attribute} from "../src/api/Api.ts";


interface ComponentAttributesState {
    attributes: Attribute[];
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: ComponentAttributesState = {
    attributes: [],
    loading: false,
    error: null,
};

// Асинхронное действие для получения списка атрибутов
export const fetchComponentAttributes = createAsyncThunk(
    "attributes/fetchComponentAttributes",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsAttributesList(id);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при загрузке атрибутов");
        }
    }
);

// Асинхронное действие для добавления атрибута
export const addComponentAttribute = createAsyncThunk(
    "attributes/addComponentAttribute",
    async ({ id, name, value }: { id: number; name: string; value: string }, { rejectWithValue }) => {
        try {
            await api.components.componentsAttributesCreate(id, { name, value });
            return { name, value };
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при добавлении атрибута");
        }
    }
);

// Асинхронное действие для удаления атрибута
export const deleteComponentAttribute = createAsyncThunk(
    "attributes/deleteComponentAttribute",
    async ({ id, name }: { id: number; name: string }, { rejectWithValue }) => {
        try {
            await api.components.componentsAttributesDelete(id, { name });
            return name;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при удалении атрибута");
        }
    }
);

// Асинхронное действие для обновления значения атрибута
export const updateComponentAttribute = createAsyncThunk(
    "attributes/updateComponentAttribute",
    async ({ id, name, value }: { id: number; name: string; value?: string }, { rejectWithValue }) => {
        try {
            const response = await api.components.componentsAttributesUpdate(id, { name, value });
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError;
            return rejectWithValue(axiosError.response?.data || "Ошибка при обновлении атрибута");
        }
    }
);

// Создание слайса
const attributesSlice = createSlice({
    name: "attributes",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchComponentAttributes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComponentAttributes.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-ignore
                state.attributes = action.payload.attributes;
            })
            .addCase(fetchComponentAttributes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(addComponentAttribute.fulfilled, (state, action) => {
                state.attributes.push(action.payload);
            })
            .addCase(deleteComponentAttribute.fulfilled, (state, action) => {
                state.attributes = state.attributes.filter(attr => attr.name !== action.payload);
            })
            .addCase(updateComponentAttribute.fulfilled, (state, action) => {
                // @ts-ignore
                const { name, value, status } = action.payload;
                if (status === "deleted") {
                    state.attributes = state.attributes.filter(attr => attr.name !== name);
                } else {
                    const attribute = state.attributes.find(attr => attr.name === name);
                    if (attribute) {
                        attribute.value = value || "";
                    }
                }
            });
    },
});

export default attributesSlice.reducer;
