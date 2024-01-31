import { storageAuthTokenGet, storageAuthTokenSave } from "@storage/storageAuthToken";
import { AppError } from "@utils/AppError";
import axios, { AxiosError, AxiosInstance } from "axios";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
}

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
}

const api = axios.create({
  baseURL: 'http://192.168.15.22:3333',
  headers: {
    "Content-Type": "application/json"
  }
}) as APIInstanceProps;

let failedQueued: Array<PromiseType> = [];
let isRefreshing = false;

api.registerInterceptTokenManager = singOut => {
  const interceptTokenManager = api.interceptors.response.use(response => response, async (requestError) => {
    if(requestError.response?.status === 401) {
      if(requestError.response.data?.message === 'token.expired' || requestError.response.data?.message === 'token.invalid') {
        const { token } = await storageAuthTokenGet();

        if(!token) {
          singOut();
          return Promise.reject(requestError)
        }

        // implementação da fila de requisições
        const originalRequestConfig = requestError.config;
        if(isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueued.push({
              onSuccess: (token: string) => { 
                originalRequestConfig.headers = { 'Authorization': `Bearer ${token}` };
                resolve(api(originalRequestConfig));
              },
              onFailure: (error: AxiosError) => {
                reject(error)
              },
            })
          })
        }

        isRefreshing = true

        //buscando o token atualizado
        return new Promise(async (resolve, reject) => {
          try {
            const { data } = await api.post('/v1/user/refresh-token', { token });

            await storageAuthTokenSave(data.token);

            if(originalRequestConfig.data) {
              originalRequestConfig.data = JSON.parse(originalRequestConfig.data);
            }

            originalRequestConfig.headers = { 'Authorization': `Bearer ${data.token}` };
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

            failedQueued.forEach(request => {
              request.onSuccess(data.token);
            });

            console.log("TOKEN ATUALIZADO");

            resolve(api(originalRequestConfig));
            
          } catch (error: any) {
            failedQueued.forEach(request => {
              request.onFailure(error);
            })

            singOut();
            reject(error);
          } finally {
            isRefreshing = false;
            failedQueued = []
          }
        })

      }

      singOut();
    }

    if(requestError.response && requestError.response.data.error){
      return Promise.reject( 
        new AppError(requestError.response.data.error ? requestError.response.data.error : requestError.response.data.message)
      )
    }else if(requestError.response && requestError.response.data){ 
      return Promise.reject( 
        new AppError(requestError.response.data)
      )
    } else {
      return Promise.reject(
        new AppError(requestError)
      )
    }
  })

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  }
}



export { api }