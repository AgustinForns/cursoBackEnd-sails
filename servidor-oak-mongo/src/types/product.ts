import { ObjectId } from "../../depts.ts";

export interface Product{
    _id: ObjectId;
    name: string;
    price: number;
    thumbnail: string;

}

//ver que la ruta es distitnta a la que usamos en express