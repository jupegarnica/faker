import { Head } from "$fresh/runtime.ts";
import { AppProps } from "$fresh/server.ts";

export default function App(props: AppProps) {
  return (
    <>
      <Head>
        <meta name="description" content="faker js api rest" />
      </Head>
      <props.Component />
    </>
  );
}