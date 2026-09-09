export async function POST(request: Request) {
  const body = await request.json();

  try{
    console.log(body["head_commit"]);
    
    return new Response(JSON.stringify({ success: true}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  }
  catch (err) {
    console.error(err);  
    return new Response(JSON.stringify({ success: false}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}