import { useState, useEffect } from "react";
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
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });

  const { current } = page;

  useEffect(() => {
    if (current === defaultEndpoint) return;

    async function request() {
      const res = await fetch(current);
      const nextData = await res.json();

      updatePage({
        current,
        ...nextData.info,
      });

      if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      });
    }

    request();
  }, [current]);

  function handleLoadMore() {
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  }

  function handleOnSubmitSearch(e) {
    e.preventDefault();

    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find((field) => field.name === "query");

    const value = fieldQuery.value || "";
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;

    updatePage({
      current: endpoint,
    });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Wubba Lubba Dub Dub!</h1>

        <p className={styles.description}>Rick and Morty Character Info</p>

        <form className={styles.search} onSubmit={handleOnSubmitSearch}>
          <input name="query" type="search" />
          <button>Search</button>
        </form>

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
        <p>
          <button onClick={handleLoadMore}>Load More</button>
        </p>
      </main>
    </div>
  );
}
