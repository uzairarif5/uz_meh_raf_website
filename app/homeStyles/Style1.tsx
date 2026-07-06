import styles from "./style1.module.css";
import { Suspense } from "react";
import Link from "next/link";
import LocalDateComp from "../clientCompsHomePage/LocalDateComp";
import { AuthorChangesType, getAuthorChanges } from "../infoStore/getUpdatesFormat";
import { style1Fonts } from "../infoStore/fonts";
import Image from 'next/image';

async function recentEditsTable() {
  const authorChanges: AuthorChangesType = await getAuthorChanges();

  return <div id={styles.changesContainer}>{
    authorChanges.map((el, i) => {
      return <div key={i} className={styles.updateLogOneDate}>
        <div className={styles.dateAndAuthorContainer}>
          <span className={styles.dateHolder}><LocalDateComp epochTime={el[0]}/></span>
          <span className={styles.authorHolder}>by {el[1].author}</span>
        </div>
        {el[1].changes.map((update, j) => {
          if (update.fName === " > ") return <span key={j} className={styles.changedRootOrdering}>Changed root ordering.</span>;
          return <div key={j} className={styles.fAndStatusContainer}>
            <span className={styles.fNameContainer}>{update.fName}</span> 
            <span className={styles.statusContainer}>{update.status}</span>
          </div>;
        })}
      </div>;
    })
  }</div>;
}

export default async function Style1() {
  return <body className={style1Fonts.CRIMSON_PRO_FONT} id={styles.body}>
    <header>
      <Image width={40} height={40} src={"/writing1.gif"} alt="" unoptimized/>
      <h1>Blog website</h1>
      <Image width={50} height={50} src={"/writing2.gif"} alt="" unoptimized/>
    </header>
    <hr/>
    <main>
      <div id={styles.linksContainer}>
        <Link style={{backgroundImage: "url(/uzair.jpg)"}} href={"./Uzair"}><span>Uzair</span></Link>
        <Link style={{backgroundImage: "url(/mehrab.jpg)"}}  href={"./Mehrab"}><span>Mehrab</span></Link>
        <Link style={{backgroundImage: "url(/rafay.jpg)"}}  href={"./Rafay"}><span>Rafay</span></Link>
        <section id={styles.aboutUs}>
          <header><Image width={30} height={30} src={"/banana.gif"} alt="" unoptimized/><h4>About Us</h4></header>
          <p>Just three daydreamers trying to navigate the cesspit that is the internet today.<br/>Come and get lost in thought yourself, it will be feeing.</p>
        </section>
      </div>
      <div id={styles.verticalLine}></div>
      <section id={styles.updatesSection}>
        <header><Image width={40} height={40} src={"/star.gif"} alt="" unoptimized/><h2>Latest updates</h2></header>
        <Suspense fallback={<></>}>{await recentEditsTable()}</Suspense>
      </section>
    </main>
  </body>;
}
