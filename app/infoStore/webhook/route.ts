export async function POST(request: Request) {
  const body = await request.json();

  try{
    const repoName = body["repository"]["name"];
    const filesModified = body["head_commit"]["modified"];

    console.log(body["head_commit"]);

    for (const fileName of filesModified) {
      fetch(`https://purge.jsdelivr.net/gh/uzairarif5/${repoName}@main/${fileName}`);
    }
    
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