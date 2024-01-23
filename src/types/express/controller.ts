import { RequestHandler } from "express";
import { APIResponse } from "../api";

export type Controller<
	Params = Record<string, never>,
	ResponseData = void,
	RequestBody = void,
	Query = Record<string, never>,
> = RequestHandler<Params, APIResponse<ResponseData>, RequestBody, Query>;
