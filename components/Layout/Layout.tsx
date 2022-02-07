import React from "react";
import Head from "next/head";

type LayoutProps = {
  pageTitle: string;
  children: JSX.Element;
};

console.log("Layotu props");
const Layout = (props: LayoutProps) => {
  console.log(props);
  return (
    <div>
      <Head>
        <title>{props.pageTitle}</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      </Head>
      <div>{props.children}</div>
    </div>
  );
};
export default Layout;
