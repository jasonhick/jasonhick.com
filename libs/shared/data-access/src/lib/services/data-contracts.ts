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

export interface Client {
   /** Client ID */
   id?: number;
   /** Client name */
   name: string;
   /** Client description */
   description?: string;
   /** Client features */
   features?: string[];
   /** Client location */
   location?: string;
   /** Role at client */
   role?: string;
   /** Client website URL */
   website?: string;
   /**
    * Project start date
    * @format date-time
    */
   start_date?: string;
   /**
    * Project end date
    * @format date-time
    */
   end_date?: string;
   /** @format date-time */
   created_at?: string;
   /** @format date-time */
   updated_at?: string;
}

export interface Project {
   id?: number;
   /** Project title */
   title: string;
   /** Project description */
   description: string;
   /** Project features */
   features?: string[];
   /** Thumbnail URL */
   thumbnail_url: string;
   /** Live project URL */
   live_url?: string;
   /** GitHub repository URL */
   github_url?: string;
   /**
    * Project start date
    * @format date-time
    */
   start_date: string;
   /**
    * Project end date
    * @format date-time
    */
   end_date: string;
   /** Featured project status */
   is_featured?: boolean;
   /** Associated client ID */
   client_id?: number;
   /** @format date-time */
   created_at?: string;
   /** @format date-time */
   updated_at?: string;
}

export interface ProjectImage {
   id?: number;
   /** Image URL */
   url: string;
   /** Image caption */
   caption?: string;
   /** Display order */
   order?: number;
   /** Associated project ID */
   project_id: number;
   /** @format date-time */
   created_at?: string;
   /** @format date-time */
   updated_at?: string;
}

export interface Skill {
   id?: number;
   /** Skill name */
   name: string;
   /** @format date-time */
   created_at?: string;
   /** @format date-time */
   updated_at?: string;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
   /** set parameter to `true` for call `securityWorker` for this request */
   secure?: boolean;
   /** request path */
   path: string;
   /** content type of request body */
   type?: ContentType;
   /** query params */
   query?: QueryParamsType;
   /** format of response (i.e. response.json() -> format: "json") */
   format?: ResponseFormat;
   /** request body */
   body?: unknown;
   /** base url */
   baseUrl?: string;
   /** request cancellation token */
   cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> {
   baseUrl?: string;
   baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
   securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
   customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
   data: D;
   error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
   Json = 'application/json',
   FormData = 'multipart/form-data',
   UrlEncoded = 'application/x-www-form-urlencoded',
   Text = 'text/plain'
}

export class HttpClient<SecurityDataType = unknown> {
   public baseUrl: string = '//127.0.0.1:5000/api';
   private securityData: SecurityDataType | null = null;
   private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
   private abortControllers = new Map<CancelToken, AbortController>();
   private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

   private baseApiParams: RequestParams = {
      credentials: 'same-origin',
      headers: {},
      redirect: 'follow',
      referrerPolicy: 'no-referrer'
   };

   constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
      Object.assign(this, apiConfig);
   }

   public setSecurityData = (data: SecurityDataType | null) => {
      this.securityData = data;
   };

   protected encodeQueryParam(key: string, value: any) {
      const encodedKey = encodeURIComponent(key);
      return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
   }

   protected addQueryParam(query: QueryParamsType, key: string) {
      return this.encodeQueryParam(key, query[key]);
   }

   protected addArrayQueryParam(query: QueryParamsType, key: string) {
      const value = query[key];
      return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
   }

   protected toQueryString(rawQuery?: QueryParamsType): string {
      const query = rawQuery || {};
      const keys = Object.keys(query).filter((key) => 'undefined' !== typeof query[key]);
      return keys
         .map((key) =>
            Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)
         )
         .join('&');
   }

   protected addQueryParams(rawQuery?: QueryParamsType): string {
      const queryString = this.toQueryString(rawQuery);
      return queryString ? `?${queryString}` : '';
   }

   private contentFormatters: Record<ContentType, (input: any) => any> = {
      [ContentType.Json]: (input: any) =>
         input !== null && (typeof input === 'object' || typeof input === 'string') ? JSON.stringify(input) : input,
      [ContentType.Text]: (input: any) => (input !== null && typeof input !== 'string' ? JSON.stringify(input) : input),
      [ContentType.FormData]: (input: any) =>
         Object.keys(input || {}).reduce((formData, key) => {
            const property = input[key];
            formData.append(
               key,
               property instanceof Blob
                  ? property
                  : typeof property === 'object' && property !== null
                    ? JSON.stringify(property)
                    : `${property}`
            );
            return formData;
         }, new FormData()),
      [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input)
   };

   protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
      return {
         ...this.baseApiParams,
         ...params1,
         ...(params2 || {}),
         headers: {
            ...(this.baseApiParams.headers || {}),
            ...(params1.headers || {}),
            ...((params2 && params2.headers) || {})
         }
      };
   }

   protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
      if (this.abortControllers.has(cancelToken)) {
         const abortController = this.abortControllers.get(cancelToken);
         if (abortController) {
            return abortController.signal;
         }
         return void 0;
      }

      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
   };

   public abortRequest = (cancelToken: CancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);

      if (abortController) {
         abortController.abort();
         this.abortControllers.delete(cancelToken);
      }
   };

   public request = async <T = any, E = any>({
      body,
      secure,
      path,
      type,
      query,
      format,
      baseUrl,
      cancelToken,
      ...params
   }: FullRequestParams): Promise<HttpResponse<T, E>> => {
      const secureParams =
         ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
            this.securityWorker &&
            (await this.securityWorker(this.securityData))) ||
         {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[type || ContentType.Json];
      const responseFormat = format || requestParams.format;

      return this.customFetch(`${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`, {
         ...requestParams,
         headers: {
            ...(requestParams.headers || {}),
            ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {})
         },
         signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
         body: typeof body === 'undefined' || body === null ? null : payloadFormatter(body)
      }).then(async (response) => {
         const r = response.clone() as HttpResponse<T, E>;
         r.data = null as unknown as T;
         r.error = null as unknown as E;

         const data = !responseFormat
            ? r
            : await response[responseFormat]()
                 .then((data) => {
                    if (r.ok) {
                       r.data = data;
                    } else {
                       r.error = data;
                    }
                    return r;
                 })
                 .catch((e) => {
                    r.error = e;
                    return r;
                 });

         if (cancelToken) {
            this.abortControllers.delete(cancelToken);
         }

         if (!response.ok) throw data;
         return data;
      });
   };
}

/**
 * @title Portfolio API
 * @version 1.0
 * @baseUrl //127.0.0.1:5000/api
 *
 * A portfolio management API
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
   clients = {
      /**
       * No description
       *
       * @tags clients
       * @name CreateClient
       * @summary Create a new client
       * @request POST:/clients/
       */
      createClient: (payload: Client, params: RequestParams = {}) =>
         this.request<Client, any>({
            path: `/clients/`,
            method: 'POST',
            body: payload,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags clients
       * @name ListClients
       * @summary List all clients
       * @request GET:/clients/
       */
      listClients: (params: RequestParams = {}) =>
         this.request<Client[], any>({
            path: `/clients/`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags clients
       * @name DeleteClient
       * @summary Delete a client
       * @request DELETE:/clients/{client_id}
       */
      deleteClient: (clientId: number, params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/clients/${clientId}`,
            method: 'DELETE',
            ...params
         }),

      /**
       * No description
       *
       * @tags clients
       * @name GetClient
       * @summary Fetch a client by ID
       * @request GET:/clients/{client_id}
       */
      getClient: (clientId: number, params: RequestParams = {}) =>
         this.request<Client, any>({
            path: `/clients/${clientId}`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags clients
       * @name UpdateClient
       * @summary Update a client
       * @request PUT:/clients/{client_id}
       */
      updateClient: (clientId: number, payload: Client, params: RequestParams = {}) =>
         this.request<Client, any>({
            path: `/clients/${clientId}`,
            method: 'PUT',
            body: payload,
            format: 'json',
            ...params
         })
   };
   projectImages = {
      /**
       * No description
       *
       * @tags project-images
       * @name CreateProjectImage
       * @summary Create a new project image
       * @request POST:/project-images/
       */
      createProjectImage: (payload: ProjectImage, params: RequestParams = {}) =>
         this.request<ProjectImage, any>({
            path: `/project-images/`,
            method: 'POST',
            body: payload,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags project-images
       * @name ListProjectImages
       * @summary List all project images
       * @request GET:/project-images/
       */
      listProjectImages: (params: RequestParams = {}) =>
         this.request<ProjectImage[], any>({
            path: `/project-images/`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags project-images
       * @name DeleteProjectImage
       * @summary Delete a project image
       * @request DELETE:/project-images/{image_id}
       */
      deleteProjectImage: (imageId: number, params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/project-images/${imageId}`,
            method: 'DELETE',
            ...params
         }),

      /**
       * No description
       *
       * @tags project-images
       * @name GetProjectImage
       * @summary Fetch a project image by ID
       * @request GET:/project-images/{image_id}
       */
      getProjectImage: (imageId: number, params: RequestParams = {}) =>
         this.request<ProjectImage, any>({
            path: `/project-images/${imageId}`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags project-images
       * @name UpdateProjectImage
       * @summary Update a project image
       * @request PUT:/project-images/{image_id}
       */
      updateProjectImage: (imageId: number, payload: ProjectImage, params: RequestParams = {}) =>
         this.request<ProjectImage, any>({
            path: `/project-images/${imageId}`,
            method: 'PUT',
            body: payload,
            format: 'json',
            ...params
         })
   };
   projects = {
      /**
       * No description
       *
       * @tags projects
       * @name CreateProject
       * @summary Create a new project
       * @request POST:/projects/
       */
      createProject: (payload: Project, params: RequestParams = {}) =>
         this.request<Project, any>({
            path: `/projects/`,
            method: 'POST',
            body: payload,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags projects
       * @name ListProjects
       * @summary List all projects
       * @request GET:/projects/
       */
      listProjects: (params: RequestParams = {}) =>
         this.request<Project[], any>({
            path: `/projects/`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags projects
       * @name DeleteProject
       * @summary Delete a project
       * @request DELETE:/projects/{project_id}
       */
      deleteProject: (projectId: number, params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/projects/${projectId}`,
            method: 'DELETE',
            ...params
         }),

      /**
       * No description
       *
       * @tags projects
       * @name GetProject
       * @summary Fetch a project by ID
       * @request GET:/projects/{project_id}
       */
      getProject: (projectId: number, params: RequestParams = {}) =>
         this.request<Project, any>({
            path: `/projects/${projectId}`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags projects
       * @name UpdateProject
       * @summary Update a project
       * @request PUT:/projects/{project_id}
       */
      updateProject: (projectId: number, payload: Project, params: RequestParams = {}) =>
         this.request<Project, any>({
            path: `/projects/${projectId}`,
            method: 'PUT',
            body: payload,
            format: 'json',
            ...params
         })
   };
   skills = {
      /**
       * No description
       *
       * @tags skills
       * @name CreateSkill
       * @summary Create a new skill
       * @request POST:/skills/
       */
      createSkill: (payload: Skill, params: RequestParams = {}) =>
         this.request<Skill, any>({
            path: `/skills/`,
            method: 'POST',
            body: payload,
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags skills
       * @name ListSkills
       * @summary List all skills
       * @request GET:/skills/
       */
      listSkills: (params: RequestParams = {}) =>
         this.request<Skill[], any>({
            path: `/skills/`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags skills
       * @name DeleteSkill
       * @summary Delete a skill
       * @request DELETE:/skills/{skill_id}
       */
      deleteSkill: (skillId: number, params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/skills/${skillId}`,
            method: 'DELETE',
            ...params
         }),

      /**
       * No description
       *
       * @tags skills
       * @name GetSkill
       * @summary Fetch a skill by ID
       * @request GET:/skills/{skill_id}
       */
      getSkill: (skillId: number, params: RequestParams = {}) =>
         this.request<Skill, any>({
            path: `/skills/${skillId}`,
            method: 'GET',
            format: 'json',
            ...params
         }),

      /**
       * No description
       *
       * @tags skills
       * @name UpdateSkill
       * @summary Update a skill
       * @request PUT:/skills/{skill_id}
       */
      updateSkill: (skillId: number, payload: Skill, params: RequestParams = {}) =>
         this.request<Skill, any>({
            path: `/skills/${skillId}`,
            method: 'PUT',
            body: payload,
            format: 'json',
            ...params
         })
   };
   swaggerJson = {
      /**
       * No description
       *
       * @tags default
       * @name GetSwaggerJson
       * @request GET:/swagger.json
       */
      getSwaggerJson: (params: RequestParams = {}) =>
         this.request<void, any>({
            path: `/swagger.json`,
            method: 'GET',
            ...params
         })
   };
}
