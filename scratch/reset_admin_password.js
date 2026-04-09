const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const uri = "mongodb+srv://deepakr_db_user:4oYOhDfezDMn2jCN@kalpcluster.mr8bacs.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const db = client.db('kalp_tenant_khfoods');
        const userColl = db.collection('users');

        const newPassword = "Admin@123";
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const result = await userColl.updateOne(
            { email: 'khfoods@admin.com' },
            { $set: { password: hashedPassword } }
        );

        if (result.matchedCount > 0) {
            console.log("Successfully reset password for khfoods@admin.com to 'Admin@123'");
        } else {
            // If not found, create it
             const newUser = {
                email: 'khfoods@admin.com',
                password: hashedPassword,
                role: 'admin',
                name: 'KHFOOD Admin',
                status: 'active',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            await userColl.insertOne(newUser);
            console.log("Created new admin user khfoods@admin.com with password 'Admin@123'");
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main();
