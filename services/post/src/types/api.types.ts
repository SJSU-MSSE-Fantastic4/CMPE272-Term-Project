import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

export type Pagination<T> = {
    href: string; // The url of the current page
    next: string; // The url of the next page
    previous: string; // The url of the previous page
    limit: number; // The maximum number of items to return in this page
    offset: number; // The offset of the items in this page
    total: number; // The total number of items available
    items: T[]; // The items in the current page
};

export interface Empty {}

export interface ParamId extends ParamsDictionary {
    id: string;
}

export interface EmptyQuery extends ParsedQs {
    // Define your query parameters here...
}

export interface EmptyParam extends ParamsDictionary {
    // Define your query parameters here...
}
