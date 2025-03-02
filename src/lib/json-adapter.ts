import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data.json");

interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
}

interface Account {
  provider: string;
  providerAccountId: string;
  userId: string;
}

interface DataSchema {
  users: User[];
  accounts: Account[];
}

// Read data from JSON file
const readData = (): DataSchema => {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify({ users: [], accounts: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error("Error reading data.json:", error);
    return { users: [], accounts: [] };
  }
};

// Write data to JSON file
const writeData = (data: DataSchema): void => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data.json:", error);
  }
};

export const jsonAdapter = {
  async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
    const data = readData();
    const account = data.accounts.find(acc => acc.provider === provider && acc.providerAccountId === providerAccountId);
    return account ? data.users.find(user => user.id === account.userId) || null : null;
  },

  async createUser(user: Omit<User, "id">) {
    const data = readData();
    const newUser: User = { id: crypto.randomUUID(), ...user };
    data.users.push(newUser);
    writeData(data);
    return newUser;
  },

  async linkAccount(account: Account) {
    const data = readData();
    if (!data.users.some(user => user.id === account.userId)) {
      throw new Error("User does not exist");
    }
    data.accounts.push(account);
    writeData(data);
    return account;
  },

  async getUser(id: string) {
    const data = readData();
    return data.users.find(user => user.id === id) || null;
  },
};
