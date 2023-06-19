import { MongoClient, Db, Collection } from 'mongodb';
import { config } from 'dotenv';
import User from '~/models/schemas/User.schema';
config();
// console.log(process.env.DB_USERNAME);

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vku-active.bnyvsqs.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

class DatabaseService {
  private client: MongoClient;
  private db: Db;
  constructor() {
    this.client = new MongoClient(uri);
    this.db = this.client.db(process.env.DB_NAME);
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.db.command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string);
  }
}

// Create object from class DatabaseService
const databaseService = new DatabaseService();
export default databaseService;
// run().catch(console.dir);
