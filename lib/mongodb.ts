import mongoose from "mongoose";

const { NEXT_PUBLIC_URI } = process.env;

if (!NEXT_PUBLIC_URI) {
    throw new Error("Invalid environment variable: NEXT_PUBLIC_URI");
}

export const connectToMongoDB = async () => {
    try
}