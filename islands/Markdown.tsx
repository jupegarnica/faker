/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import { marked } from "marked";
import { useEffect, useState } from "preact/hooks";
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
  const [error, setError] = useState('');
  const [md, setMd] = useState('');
  useEffect(() => {
    fetch(`/docs/${props.path}.md`)
      .then(r => r.status >= 200 && r.status < 300 ? r.text() : Promise.reject(r) )
      .then(setMd)
      .catch((e: Response) => {setError(`path: ${props.path} ${e.status} ${e.statusText}`); console.error(e)})
  }, [props.path]);
  return (
    <div className={tw`p-4 mx-auto max-w-screen-md`}>
      {md && <div dangerouslySetInnerHTML={{ __html: marked(md) }} />}
      {error && <h1 className={tw`text-red-500`}>{error}</h1>}
    </div>
  );
}
