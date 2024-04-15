import express, { Request, Response } from 'express';
import { initDatabase, readData } from "./db/db";

const app = express();
const PORT = process.env.PORT || 3000;

const createRouteHandler = (tableName: string) => {
    return async (req: Request, res: Response) => {
        try {
            const limit = parseInt(req.query.limit as string) || Infinity;
            const offset = parseInt(req.query.offset as string) || 0;
            const whereKey = req.query.whereKey as string || '';
            const whereLike = req.query.whereLike as string || '';

            const outputData = await readData(tableName, limit, offset, whereKey, whereLike);
            console.log('params:', req.params);
            console.log('actualParams:', `${tableName}, ${limit}, ${offset}, ${whereKey}, ${whereLike}`);
            console.log('outputData:', outputData);
            res.json(outputData);
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    };
};

const routes = [
    { path: '/suppliers', tableName: 'Supplies' },
    { path: '/products', tableName: 'Products' },
    { path: '/orders', tableName: 'Orders' },
    { path: '/employees', tableName: 'Employees' },
    { path: '/customers', tableName: 'Customers' }
];

initDatabase();

routes.forEach(({ path, tableName }) => {
    app.get(path, createRouteHandler(tableName));
});

const pingRandomRoute = () => {
    const randomIndex = Math.floor(Math.random() * routes.length);
    const randomRoute = routes[randomIndex].path;
    console.log(`Pinging route: ${randomRoute}`);
    fetch(`http://localhost:${PORT}${randomRoute}?limit=1`)
        .then(response => response.json())
        .then(data => console.log('Ping response:', data))
        .catch(error => console.error('Error pinging route:', error));
};

const pingInterval = Math.floor(Math.random() * (180000 - 120000)) + 120000;
setInterval(pingRandomRoute, pingInterval);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
