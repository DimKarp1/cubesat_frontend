/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

// @ts-ignore
import Cookies from "js-cookie";

export interface Assembly {
    /** ID */
    id?: number;
    /**
     * SatelliteName
     * @maxLength 150
     */
    satelliteName?: string | null;
    /**
     * FlyDate
     * @format date
     */
    flyDate?: string | null;
    /**
     * Status
     * @minLength 1
     */
    status?: string;
    /**
     * Creator
     * @minLength 1
     */
    creator?: string;
    /**
     * Moder
     * @minLength 1
     */
    moder?: string;
    /**
     * DateCreated
     * @format date
     */
    dateCreated?: string;
    /**
     * DateModerated
     * @format date
     */
    dateModerated?: string | null;
    /**
     * DateSaved
     * @format date
     */
    dateSaved?: string | null;
    /**
     * Total price
     * @min -2147483648
     * @max 2147483647
     */
    total_price?: number | null;
}

export interface AssemblyStatus {
    /**
     * Status
     * @minLength 1
     */
    status: string;
}

export interface User {
    /**
     * Имя пользователя
     * @minLength 1
     */
    username: string;
    /**
     * Пароль
     * @minLength 1
     */
    password: string;
    /** Модератор */
    is_staff?: boolean;
    /** Админ */
    is_superuser?: boolean;
}

export interface Component {
    /** ID */
    id?: number;
    /**
     * Title
     * @minLength 1
     * @maxLength 200
     */
    title: string;
    /**
     * ShortDescription
     * @minLength 1
     */
    shortDescription: string;
    /**
     * Description
     * @minLength 1
     */
    description: string;
    /**
     * Price
     * @min -2147483648
     * @max 2147483647
     */
    price: number;
    /** Is active */
    is_active?: boolean;
    /**
     * ImgSrc
     * @minLength 1
     */
    imgSrc?: string | null;
}

export interface MM {
    component?: Component;
    /**
     * Count
     * @min -2147483648
     * @max 2147483647
     */
    count?: number;
}

import type {AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseType;
    /** request body */
    body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
    securityWorker?: (
        securityData: SecurityDataType | null,
    ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
    secure?: boolean;
    format?: ResponseType;
}

export enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
    public instance: AxiosInstance;
    private securityData: SecurityDataType | null = null;
    private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
    private secure?: boolean;
    private format?: ResponseType;

    constructor({securityWorker, secure, format, ...axiosConfig}: ApiConfig<SecurityDataType> = {}) {
        this.instance = axios.create({...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000/api"});
        this.secure = secure;
        this.format = format;
        this.securityWorker = securityWorker;
    }

    public setSecurityData = (data: SecurityDataType | null) => {
        this.securityData = data;
    };

    protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
        const method = params1.method || (params2 && params2.method);

        return {
            ...this.instance.defaults,
            ...params1,
            ...(params2 || {}),
            headers: {
                ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
                ...(params1.headers || {}),
                ...((params2 && params2.headers) || {}),
            },
        };
    }

    protected stringifyFormItem(formItem: unknown) {
        if (typeof formItem === "object" && formItem !== null) {
            return JSON.stringify(formItem);
        } else {
            return `${formItem}`;
        }
    }

    protected createFormData(input: Record<string, unknown>): FormData {
        if (input instanceof FormData) {
            return input;
        }
        return Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            const propertyContent: any[] = property instanceof Array ? property : [property];

            for (const formItem of propertyContent) {
                const isFileType = formItem instanceof Blob || formItem instanceof File;
                formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
            }

            return formData;
        }, new FormData());
    }

    public request = async <T = any, _E = any>({
                                                   secure,
                                                   path,
                                                   type,
                                                   query,
                                                   format,
                                                   body,
                                                   ...params
                                               }: FullRequestParams): Promise<AxiosResponse<T>> => {
        const secureParams =
            ((typeof secure === "boolean" ? secure : this.secure) &&
                this.securityWorker &&
                (await this.securityWorker(this.securityData))) ||
            {};
        const requestParams = this.mergeRequestParams(params, secureParams);
        const responseFormat = format || this.format || undefined;

        if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
            body = this.createFormData(body as Record<string, unknown>);
        }

        if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
            body = JSON.stringify(body);
        }

        const csrfToken = Cookies.get('csrftoken');
        return this.instance.request({
            ...requestParams,
            headers: {
                ...(requestParams.headers || {}),
                ...(type ? {"Content-Type": type} : {}),
                ...(csrfToken ? {'X-CSRFToken': csrfToken} : {}),
            },
            params: query,
            responseType: responseFormat,
            data: body,
            url: path,
        });
    };
}

/**
 * @title RASA API
 * @version v1
 * @license BSD License
 * @baseUrl http://localhost:8000/api
 * @contact <contact@snippets.local>
 *
 * RASA Web Service
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    assemblies = {
        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesList
         * @request GET:/assemblies/
         * @secure
         */
        assembliesList: (params?: { query: { status?: string; date_start?: string; date_end?: string } }) =>
            this.request<void, any>({
                path: `/assemblies/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesRead
         * @request GET:/assemblies/{id}/
         * @secure
         */
        assembliesRead: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/assemblies/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesUpdate
         * @request PUT:/assemblies/{id}/
         * @secure
         */
        assembliesUpdate: (id: string, data: Assembly, params: RequestParams = {}) =>
            this.request<Assembly, any>({
                path: `/assemblies/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesDelete
         * @request DELETE:/assemblies/{id}/
         * @secure
         */
        assembliesDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/assemblies/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesFormCreate
         * @request POST:/assemblies/{id}/form/
         * @secure
         */
        assembliesFormCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/assemblies/${id}/form/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags assemblies
         * @name AssembliesModerateCreate
         * @request POST:/assemblies/{id}/moderate/
         * @secure
         */
        assembliesModerateCreate: (id: string, data: AssemblyStatus, params: RequestParams = {}) =>
            this.request<AssemblyStatus, any>({
                path: `/assemblies/${id}/moderate/`,
                method: "POST",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),
    };
    auth = {
        /**
         * No description
         *
         * @tags auth
         * @name AuthLoginCreate
         * @request POST:/auth/login/
         * @secure
         */
        authLoginCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/auth/login/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthLogoutCreate
         * @request POST:/auth/logout/
         * @secure
         */
        authLogoutCreate: (params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/auth/logout/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthProfileUpdate
         * @request PUT:/auth/profile/
         * @secure
         */
        authProfileUpdate: (data: { id: number; username?: string; password?: string }, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/auth/profile/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags auth
         * @name AuthRegisterCreate
         * @request POST:/auth/register/
         * @secure
         */
        authRegisterCreate: (data: User, params: RequestParams = {}) =>
            this.request<User, any>({
                path: `/auth/register/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),
    };
    components = {
        /**
         * No description
         *
         * @tags components
         * @name ComponentsList
         * @request GET:/components/
         * @secure
         */
        componentsList: (
            query?: {
                /** Название компонента */
                component_name?: string;
            },
            params: RequestParams = {},
        ) =>
            this.request<Component[], any>({
                path: `/components/`,
                method: "GET",
                query: query,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsCreate
         * @request POST:/components/
         * @secure
         */
        componentsCreate: (data: Component, params: RequestParams = {}) =>
            this.request<Component, any>({
                path: `/components/`,
                method: "POST",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsRead
         * @request GET:/components/{id}/
         * @secure
         */
        componentsRead: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsUpdate
         * @request PUT:/components/{id}/
         * @secure
         */
        componentsUpdate: (id: string, data: Component, params: RequestParams = {}) =>
            this.request<Component, any>({
                path: `/components/${id}/`,
                method: "PUT",
                body: data,
                secure: true,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsDelete
         * @request DELETE:/components/{id}/
         * @secure
         */
        componentsDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsAddToDraftCreate
         * @request POST:/components/{id}/add-to-draft/
         * @secure
         */
        componentsAddToDraftCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/add-to-draft/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsAttributesList
         * @request GET:/components/{id}/attributes/
         * @secure
         */
        componentsAttributesList: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/attributes/`,
                method: "GET",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsAttributesCreate
         * @request POST:/components/{id}/attributes/
         * @secure
         */
        componentsAttributesCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/attributes/`,
                method: "POST",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsAttributesUpdate
         * @request PUT:/components/{id}/attributes/
         * @secure
         */
        componentsAttributesUpdate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/attributes/`,
                method: "PUT",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsAttributesDelete
         * @request DELETE:/components/{id}/attributes/
         * @secure
         */
        componentsAttributesDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/attributes/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsDraftUpdate
         * @request PUT:/components/{id}/draft/
         * @secure
         */
        componentsDraftUpdate: (id: string, data: MM, params: RequestParams = {}) =>
            this.request<MM, any>({
                path: `/components/${id}/draft/`,
                method: "PUT",
                body: data,
                secure: true,
                type: ContentType.Json,
                format: "json",
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsDraftDelete
         * @request DELETE:/components/{id}/draft/
         * @secure
         */
        componentsDraftDelete: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/draft/`,
                method: "DELETE",
                secure: true,
                ...params,
            }),

        /**
         * No description
         *
         * @tags components
         * @name ComponentsImageCreate
         * @request POST:/components/{id}/image/
         * @secure
         */
        componentsImageCreate: (id: string, params: RequestParams = {}) =>
            this.request<void, any>({
                path: `/components/${id}/image/`,
                method: "POST",
                secure: true,
                ...params,
            }),
    };
}
