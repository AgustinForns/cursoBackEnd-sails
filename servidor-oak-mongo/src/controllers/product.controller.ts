import { Context, helpers, config, MongoClient, ObjectId } from "../../depts.ts";
import {Product} from "../types/product.ts";

const {MONGO_URL,DATABASE_NAME} = config();

//conexion de mongo
const client = new MongoClient();
try {
    await client.connect(MONGO_URL);
    console.log("conexion a la base de datos exitosa!")
} catch (error) {
    console.log(error)
}

const db = client.database(DATABASE_NAME);///instancia de la base de datos
const productModel = db.collection<Product>("products"); //antes del parentesis definimos el tipo de usuario

export const findProducts = async(ctx:Context)=>{
    try {
        const products = await productModel.find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:products}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const findProductById = async(ctx:Context)=>{
    try {
        const {id} = helpers.getQuery(ctx,{mergeParams:true}); //req.params.id;
        const product = await productModel.findOne({_id: new ObjectId(id)});
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:product};
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const createProduct = async(ctx:Context)=>{
    try {
        const product = await ctx.request.body().value;
        console.log(product)
        const productCreated = await productModel.insertOne({
            name: product.get("name"),
            price: product.get("price"),
            url: product.get("url")
        });
    
        ctx.response.status = 200;
        ctx.response.body = {status:"success",data:productCreated, message:"product created"}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const deleteProduct = async(ctx:Context)=>{
    try {
        const {id} = helpers.getQuery(ctx,{mergeParams:true}); //req.params.id;
        const productDeleted = productModel.deleteOne({_id: new ObjectId(id)})
        ctx.response.status = 200;
        ctx.response.body = {status:"success",data:productDeleted, message:"product deleted"}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};