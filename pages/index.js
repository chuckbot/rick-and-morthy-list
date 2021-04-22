import Head from "next/head";
import styles from "../styles/Home.module.css";

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { results = [] } = data;
  console.log("data", data);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wubba Lubba Dub Dub!</h1>

        <p className={styles.description}>Rick and Morty Character Info</p>

        <ul className={styles.grid}>
          {results.map((result) => {
            const { id, name, image } = result;
            return (
              <li key={id} className={styles.card}>
                <a href="#">
                  <img src={image} alt={`${name} Thumbnail`} />
                  <h3>{name}</h3>
                </a>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
