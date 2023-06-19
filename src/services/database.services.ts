import { MongoClient, ServerApiVersion } from 'mongodb';
import { config } from 'dotenv';
config();
// console.log(process.env.DB_USERNAME);

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@vku-active.bnyvsqs.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

class DatabaseService {
  private client: MongoClient;
  constructor() {
    this.client = new MongoClient(uri);
  }

  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 });
      console.log('Pinged your deployment. You successfully connected to MongoDB!');
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }
}
// Create object from class DatabaseService
const databaseService = new DatabaseService();
export default databaseService;
// run().catch(console.dir);
