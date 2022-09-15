import { PageProps } from "$fresh/server.ts";
import Markdown from "../../islands/Markdown.tsx";

export default function Docs(props: PageProps) {
  return (
    <div >
      <Markdown path={props.params.path} />
    </div>
  );
}
