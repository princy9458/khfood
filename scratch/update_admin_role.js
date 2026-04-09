const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('kalp_tenant_khfoods');
        const userColl = db.collection('users');

        const result = await userColl.updateOne(
            { email: 'khfoods@admin.com' },
            { $set: { role: 'admin' } }
        );

        console.log("Role update result:", result.modifiedCount > 0 ? "Success" : "Already set or Failed");

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
