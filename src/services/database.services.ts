import { MongoClient, ServerApiVersion } from 'mongodb';
const uri = 'mongodb+srv://lantuyan:lantuyan@vku-active.bnyvsqs.mongodb.net/?retryWrites=true&w=majority';

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
