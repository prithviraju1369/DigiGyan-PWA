export interface profile{
	_id?:string,
    username?: string;
    password?: string;
    tags?: Array<string>;
}

export interface tag{
	_id?:string,
    name?: string;
    selected?:boolean;
}

export interface question{
	_id?:string,
    title?: string;
    description?: string;
    tags?: Array<string>;
    user?:string;
}
