/** @jsx h */
/** @jsxFrag Fragment */
import { Fragment, h } from "preact";
import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="faker-api-rest" content="faker-api-rest" />
        <link rel="stylesheet" href="/pico.classless.min.css" />
      </Head>
      <main>
        <props.Component />
      </main>
    </>
  );
}
