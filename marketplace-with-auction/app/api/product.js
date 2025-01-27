import { connectToDatabase, isVerifiedMerchant } from '../../../libs/functions';

// Connect to the database
connectToDatabase();


// Export the API routes
export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            if (await isVerifiedMerchant(req, res)) {
                await createProduct(req, res);
            }
            break;
        case 'GET':
            await fetchProducts(req, res);
            break;
        case 'PUT':
            if (await isVerifiedMerchant(req, res)) {
                await updateProduct(req, res);
            }
            break;
        case 'DELETE':
            if (await isVerifiedMerchant(req, res)) {
                await deleteProduct(req, res);
            }
            break;
        default:
            res.setHeader('Allow', ['POST', 'GET', 'PUT', 'DELETE']);
            res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
