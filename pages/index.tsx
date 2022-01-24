import Head from "next/head";
import Header from "../components/Header";

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Muidem Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <h1>Medium</h1>
    </div>
  );
}
