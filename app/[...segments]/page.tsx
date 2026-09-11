import githubRepoName from "../infoStore/githubReponames";
import styles from "./style1.module.css";
import { style1Fonts } from "../infoStore/fonts";
import Main from "./Style1";

export default async function Page({params}: { params: Promise<{ segments: string[] }>}) {
  const authors = Object.keys(githubRepoName);
  const { segments } = await params;

  if (!(authors.includes(segments[0]))) return <UnknownAuthor author={segments[0]}/>;

  return <Main repoName={githubRepoName[segments[0]]} segments={segments}/>
}

function UnknownAuthor(props: {author: string}) {
  return <body className={style1Fonts.CRIMSON_PRO_FONT} id={styles.body}>
    <header>
      <p>Error: No author as "{props.author}"</p>;
    </header>
  </body>;
}