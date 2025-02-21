// pages/api/verify-transfer.js

export async function GET(req) {
    const { tx_ref } = req.nextUrl.searchParams;
  
    if (!tx_ref) {
      return new Response(
        JSON.stringify({ message: 'Transaction reference is required' }),
        { status: 400 }
      );
    }
  
    const url = `https://api.chapa.co/v1/transfers/verify/${tx_ref}`;
    const secretKey = process.env.CHAPA_SECRET_KEY;
  
    try {
      // Making the GET request to Chapa API with fetch
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${secretKey}`,
        },
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Return the transfer details if successful
        return new Response(JSON.stringify(data), { status: 200 });
      } else {
        // Return error details if failed
        return new Response(JSON.stringify(data), { status: 400 });
      }
    } catch (error) {
      console.error('Error verifying transfer:', error);
      return new Response(
        JSON.stringify({ message: 'Internal server error' }),
        { status: 500 }
      );
    }
  }
  