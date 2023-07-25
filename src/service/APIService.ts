import { LocalStorageKey, StatusCodes } from "../enum";

interface IRequestInit extends RequestInit {
	headers: {
		[key: string]: string;
	};
}
class APIService {
	private static instance: APIService;
	private readonly baseUrl: string;
	private token: string | null = null;
	constructor() {
		this.setToken();
		// @ts-ignore
		if (import.meta.env.MODE === "production") {
			// @ts-ignore
			this.baseUrl = import.meta.env.VITE_API_PROD
		} else {
			// @ts-ignore
			this.baseUrl = import.meta.env.VITE_API_DEV
		}
	}

	private setToken() {
		const data = window.localStorage.getItem(LocalStorageKey.USER)
		if (data === null) {
			/// force logout
		} else {
			const { token } = JSON.parse(data)
			this.token = token
		}
	}

	public static getInstance(): APIService {
		if (!APIService.instance) {
			APIService.instance = new APIService();
		}
		return APIService.instance;
	}
	private async makeRequest<T>(
		endpoint: string,
		method: string,
		data: unknown | null = null
	): Promise<T | any> {
		const url = `${this.baseUrl}/api/${endpoint}`;
		const options: IRequestInit = {
			method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${this.token}`,
			},
		};

		if (data) {
			options.body = JSON.stringify(data);
		}

		try {
			const response = await fetch(url, options);
			if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`Request failed with status ${response.status}`);
			}
			return {
				data: await response.json(),
				status: response.status
			}
		} catch (error: any) {
			// console.error("API Request Error:", error);
		}
	}

	public get<T>(endpoint: string): Promise<T> {
		return this.makeRequest<T>(endpoint, "GET");
	}

	public post<T>(endpoint: string, data: unknown): Promise<T> {
		return this.makeRequest<T>(endpoint, "POST", data);
	}

	public put<T>(endpoint: string, data: unknown): Promise<T> {
		return this.makeRequest<T>(endpoint, "PUT", data);
	}

	public patch<T>(endpoint: string, data: unknown): Promise<T> {
		return this.makeRequest<T>(endpoint, "PATCH", data);
	}

	public delete<T>(endpoint: string): Promise<T> {
		return this.makeRequest<T>(endpoint, "DELETE");
	}

	public async insertFormData<T>(endpoint: string, data: FormData): Promise<T | any> {
		const url = `${this.baseUrl}/api/${endpoint}`;
		const options: IRequestInit = {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
			body: data
		};
		try {
			const response = await fetch(url, options);
			if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`Request failed with status ${response.status}`);
			}
			return {
				data: await response.json(),
				status: response.status
			}
		} catch (error: any) {
			// console.error("API Request Error:", error);
		}
	}
	public async updateFormData<T>(endpoint: string, data: FormData): Promise<T | any> {
		const url = `${this.baseUrl}/api/${endpoint}`;
		const options: IRequestInit = {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${this.token}`,
			},
			body: data
		};
		try {
			const response = await fetch(url, options);
			if (response.status === StatusCodes.INTERNAL_SERVER_ERROR) {
				// noinspection ExceptionCaughtLocallyJS
				throw new Error(`Request failed with status ${response.status}`);
			}
			return {
				data: await response.json(),
				status: response.status
			}
		} catch (error: any) {
			// console.error("API Request Error:", error);
		}
	}
}
export default APIService.getInstance();
