import { Sequelize } from 'sequelize';
import { connect, Error } from 'mongoose';

import { Application } from '@interfaces';
import { Print } from '@helpers/chalk';
import { carrier } from '@helpers/carrier';

// app 以后可能有用~
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function MongooseFactory (app: Application): Promise<boolean> {
    //
    const connectURL = process.env.MONGO_CONNECT_URL || 'mongodb://localhost:27017/database';
    //
    await connect(connectURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err: Error) => {
        if (err) {
            throw err;
        }
        Print.log('MongoDB connect success!');
    });
    return true;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function PostgresFactory (app: Application): Promise<void> {
    //
    const host = process.env.POSTGRES_CONNECT_HOST;
    const port = Number(process.env.POSTGRES_CONNECT_PORT);
    //
    const sequelize = new Sequelize('postgres', 'postgres', '123456', {
        dialect: 'postgres',
        host,
        port,
        // logging: (...msg): void => console.log(msg),
        logging: false,
        timezone: '+08:00',
        define: {}
    });
    // 绑定在全局变量上
    carrier.set({ key: 'sequelize', value: sequelize });
    //
    try {
        await sequelize.authenticate();
        //
        await sequelize.sync();
        //
        Print.log('Connection has been established successfully.');
    } catch (error) {
        Print.error(error);
    }
};

// class User extends Model {}

// User.init({
//     id: {
//         type: DataTypes.INTEGER,
//         // 主键
//         primaryKey: true,
//         autoIncrement: true
//     },
//     username: {
//         type: DataTypes.STRING,
//         allowNull: false
//     },
//     password: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     sequelize,
//     modelName: 'User'
// });

// async function createUser (): Promise<void> {
//     await User.create({
//         username: 'admin',
//         password: '123456'
//     });
//     console.log('done!');
// }

// createUser();
