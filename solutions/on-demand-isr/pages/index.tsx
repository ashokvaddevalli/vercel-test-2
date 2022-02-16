import type { Product } from "../types"
import type { FC } from "react"

import Head from "next/head"
import { Layout, Text, Page, Code, Link, Button } from "@vercel/examples-ui"

import { GetStaticProps } from "next"
import api from "../api"
import Image from "next/image"

interface Props {
  products: Product[]
  date: string
}

const Snippet: FC = ({ children }) => {
  return (
    <pre className="border-accents-2 border rounded-md bg-white overflow-x-auto p-6 transition-all">
      {children}
    </pre>
  )
}

const ProductCard: React.VFC<{ product: Product }> = ({ product }) => {
  return (
    <div
      className={`flex flex-col shadow-lg overflow-hidden relative ${
        product.hasStock ? "opacity-100" : "opacity-50 cursor-not-allowed"
      }`}
    >
      <Image
        layout="responsive"
        width="100%"
        height="48"
        objectFit="cover"
        src={product.image}
        alt=""
      />
      <div className="flex-1 bg-white p-6 flex flex-col justify-between">
        <div className="flex-1">
          <p className="text-sm leading-5 font-medium text-indigo-600 uppercase tracking-wide text-sm text-indigo-600 font-bold">
            {product.category}
          </p>
          <h3 className="mt-2 text-xl leading-7 font-semibold text-gray-900">
            {product.title}
          </h3>
          <p className="mt-2 text-base leading-6 text-gray-500">
            {product.description}
          </p>
        </div>
        <div className="mt-4 text-xl leading-none font-extrabold text-gray-900">
          <span>{product.hasStock ? product.price : "Not available"}</span>
        </div>
      </div>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const products = await api.list()

  return {
    props: {
      products,
      date: new Date().toTimeString(),
    },
    revalidate: 3600,
  }
}

function Home({ products, date }: Props) {
  async function handleRevalidate() {
    await fetch("/api/revalidate")

    window.location.reload()
  }

  return (
    <Page>
      <Head>
        <title>On demand ISR - Vercel Example</title>
        <meta
          name="description"
          content="Vercel example how to use On demand ISR"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section className="flex flex-col gap-6">
        <Text variant="h1">On demand ISR usage example</Text>
        <Text>
          Next.js allows you to create or update static pages after you’ve built
          your site. Incremental Static Regeneration (ISR) enables you to use
          static-generation on a per-page basis, without needing to rebuild the
          entire site. With ISR, you can retain the benefits of static while
          scaling to millions of pages.
        </Text>
        <Snippet>
          {`// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  return {
    props: {
      posts,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds
    revalidate: 10, // In seconds
  }
}`}
        </Snippet>
        <Text>
          Would not be great if we only regenerate this page when our data
          changes? Wince Next.js 12.1 we can do that using the{" "}
          <Code>res.revalidate</Code> function in our{" "}
          <Link href="https://nextjs.org/docs/api-routes/introduction">
            api routes
          </Link>
          .
        </Text>
        <Snippet>
          {`export default async function handler(_req, res) {
  // Revalidate our '/' path
  await res.unstable_revalidate('/')

  // Return a response to confirm everything went ok
  return res.json({revalidated: true})
}
`}
        </Snippet>
        <Text>
          Calling this api route will revalidate our content on demand, allowing
          us to increment or even remove the time revalidation in our pages. On
          demand revalidation might be useful for commerce providers, webhooks,
          bots, etc. That might fire when our content has been changed.
        </Text>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-3">
        <Text variant="h2">Demo</Text>
        <Text>
          This demo was generated on <Code>{date}</Code>, product prices and
          stock might have changed since then. You can try revalidating this
          content.
        </Text>
        <Text>Click here to revalidate:</Text>
        <Button onClick={handleRevalidate} className="w-fit" variant="black">
          Revalidate
        </Button>
        <Text>Or call the revalidate endpoint:</Text>
        <Link href="/api/revalidate">
          <pre className="bg-black text-white font-mono text-left py-2 px-4 rounded-lg text-sm leading-6 w-fit">
            /api/revalidate
          </pre>
        </Link>

        <hr className="border-t border-accents-2 my-6" />

        <article className="grid gap-6 grid-cols-1 md:grid-cols-2">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </article>
      </section>

      <hr className="border-t border-accents-2 my-6" />

      <section className="flex flex-col gap-6">
        <Text>
          Remember to always be careful when exposing endpoints as they may be
          vulnerable to DDOS attacks. You can request a key, token, etc. to
          protect the endpoint from unwanted requests.{" "}
          Below you can see an example of a #nextjs
          tweet feed that is being revalidated by a protected webhook.
        </Text>
        <Link href="/tweets">
          <Button className="m-auto" size="lg">#nextjs tweets feed example</Button>
        </Link>
      </section>
    </Page>
  )
}

Home.Layout = Layout

export default Home
