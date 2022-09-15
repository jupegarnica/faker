import { Head } from "$fresh/runtime.ts";
import { marked } from "marked";
import { useEffect, useState } from "preact/hooks";
import { asset } from "$fresh/runtime.ts";
marked.use({
  gfm: true,
  // pedantic: false,
  // breaks: false,
  // sanitize: false,
  // smartLists: true,
  // smartypants: false,
  // xhtml: false
});
interface Props {
  path: string;
}

export default function Md(props: Props) {
  const [error, setError] = useState("");
  const [md, setMd] = useState("");
  useEffect(() => {
    fetch(asset(`/static/md/${props.path}.md`))
      .then((r) =>
        r.status >= 200 && r.status < 300 ? r.text() : Promise.reject(r)
      )
      .then(setMd)
      .catch((e: Response) => {
        setError(`path: ${props.path} ${e.status} ${e.statusText}`);
        console.error(e);
      });
  }, [props.path]);
  return (
    <>
      <Head>
        <title>{props.path ?? "Not Found"}</title>
        <link
          rel="stylesheet"
          href={`/static/pico.classless.min.css?build=${__FRSH_BUILD_ID}`}
        />
        <style>
          {`
        html, body {
          background-color: #141e26;
          }
          .markdown {
            padding: 1rem;
          }`}
        </style>
      </Head>
      <article class="markdown" data-theme="dark" style="text-align: center">
        {md && (
          <div
            style="margin: 0 auto; text-align: left; max-width: 800px"
            dangerouslySetInnerHTML={{ __html: marked(md) }}
          />
        )}
        {error && <h1 style="color:red">{error}</h1>}
      </article>
    </>
  );
}
