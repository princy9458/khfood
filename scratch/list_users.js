const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        
        console.log("--- kalp_tenant_khfoods users ---");
        const dbTenant = client.db('kalp_tenant_khfoods');
        const usersTenant = await dbTenant.collection('users').find({}).toArray();
        usersTenant.forEach(u => console.log(`Email: ${u.email}, Role: ${u.role}, ID: ${u._id}`));

        console.log("\n--- kalp_master users ---");
        const dbMaster = client.db('kalp_master');
        const usersMaster = await dbMaster.collection('users').find({}).toArray();
        usersMaster.forEach(u => console.log(`Email: ${u.email}, Role: ${u.role}, Tenant: ${u.tenantKey}, ID: ${u._id}`));

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
