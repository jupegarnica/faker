/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import Markdown from "../islands/Markdown.tsx";
export default function Home() {
  return (
    <div className={tw`p-4 mx-auto max-w-screen-md`}>
      <Markdown path="README" />
    </div>
  );
}
