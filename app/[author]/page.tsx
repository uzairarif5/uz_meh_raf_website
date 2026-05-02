import Link from "next/link";
import { promises as fs } from 'fs';
import path from 'path';

export default async function Page({params}: { params: Promise<{ author: string }>}) {
  const { author } = await params;

  const filePath = path.join(process.cwd(), 'app/_content/', author, 'order.txt');
  const content = await fs.readFile(filePath, 'utf8');
  console.log(content);

  return <div>
    <p>Author name: {author}</p>
    <p>Welcome to {author}'s blogs.</p>
    <Link href={"/"}>home page</Link>
    <hr/>
  </div>
}