export async function POST(request: Request) {
  const body = await request.json();

  console.log(body);
  
  return new Response(JSON.stringify({ success: "true"}), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}