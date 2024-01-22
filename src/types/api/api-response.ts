export type APIResponse<Data = void> =
	| {
			success: true;
			code: number;
			data?: Data;
			message?: string;
	  }
	| {
			success: false;
			code: number;
			error: string;
	  };
