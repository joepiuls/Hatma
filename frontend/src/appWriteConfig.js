// src/appwriteConfig.js

import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1') // Set your Appwrite endpoint
  .setProject('6820d3d00026b6a67184'); // Set your Appwrite Project ID

const account = new Account(client);
const databases = new Databases(client);

const createUser = async (email, password) => {
  try {
    // This will create a new user in Appwrite
    const user = await account.create('unique()', email, password);
    console.log('User created:', user);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export { client, account, databases, createUser };
