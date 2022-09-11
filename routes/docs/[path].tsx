/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { tw } from "@twind";
import Markdown from "../../islands/Markdown.tsx";

export default function Greet(props: PageProps) {
  return (
    <div className={tw`p-4 mx-auto max-w-screen-md`}>
      <Markdown path={props.params.path} />
    </div>
  );
}
