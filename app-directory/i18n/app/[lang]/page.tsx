import { Page, Text, Link, Code, Snippet } from '@vercel/examples-ui'
import Counter from './components/counter'
import Welcome from './components/welcome'

interface Props {
  params: {
    lang: 'es' | 'en' | 'de'
  }
}

export async function generateStaticParams() {
  return [{ lang: 'es' }, { lang: 'en' }, { lang: 'de' }]
}

export default async function Home({ params }: Props) {
  const { counter } = await import(`../../dictionaries/${params.lang}.json`)

  return (
    <Page className="flex flex-col gap-12">
      <section className="flex flex-col gap-6">
        <Text variant="h1">Handling i18n withing app dir</Text>
        <Text>
          Previously, routing was handled automatically. With app dir you have
          to handle the routes yourself. Combining{' '}
          <Link href="https://beta.nextjs.org/docs/api-reference/generate-static-params">
            <Code>generateStaticParams</Code>
          </Link>{' '}
          with layouts or pages we can get what we need for an internationalized
          app.
        </Text>
      </section>

      <section className="flex flex-col gap-3">
        <Text variant="h2">Creating the files</Text>
        <Text>
          We will create a <Code>[lang]</Code> folder as a parent of all the
          routes in our app that need to be internationalized. In case all your
          app needs to be, create it on the root of the <Code>app</Code> folder.
          We will also create a <Code>dictonaries</Code> folder anywhere in your
          app with the translations for each language.
        </Text>
        <pre className="border border-accents-2 rounded-md bg-accents-1 overflow-x-auto p-6">{`|/dictonaries
|__/en.json
|__/es.json
|/app
|__/[lang]
|____/page.js
`}</pre>
      </section>

      <section className="flex flex-col gap-6">
        <Text variant="h2">Using translations</Text>
        <Text>
          Now, inside the <Code>[lang]/page.js</Code> we will have acess to the{' '}
          <Code>lang</Code> param. We can just import the translations we need
          and use them in our page.
        </Text>
        <Snippet>
          {`export default async function Home({ params }) {
  const { home } = await import(\`../../dictionaries/$\{params.lang}.json\`);
  
  return (
    <h1>{home.title}</h1>
  )
}`}
        </Snippet>
        <Text>
          If we want to generate this pages statically at build time we can add{' '}
          <Code>generateStaticParams</Code> to our page.
        </Text>
        <Snippet>
          {`export async function generateStaticParams() {
  return [{ lang: "es" }, { lang: "en" }, { lang: "de" }];
}`}
        </Snippet>
        <Text>
          Now this page will generate all three languages statically at build
          time. We can see the example below.
        </Text>
        <Welcome lang={params.lang} />
        <Text>
          Because all our components are server components, all this
          translations were handled on the server and just the HTML output is
          sent to the frontend, so no need to filter out the unused keys. But
          keep in mind that the object is kept in memory on the server so ensure
          you split your translations files in something that does not affect
          your server resources.
        </Text>
      </section>

      <section className="flex flex-col gap-6">
        <Text variant="h2">Usage in client components</Text>
        <Text>
          Once we reach a client component we lose the ability to get
          translations from the server, so the safest approach would be to load
          the translations from the nearest parent and send them through props
          to our client component. Once translations are there, they can be
          drilled to other components, handled by a context + hook or whatever
          solution you currently use for handling client side translations.
        </Text>
        <Snippet>
          {`export default async function Home({ params }) {
  const { counter } = await import(\`../../dictionaries/$\{params.lang}.json\`);
  
  return (
    <div>
      <h1>{home.title}</h1>
      <Counter translations={counter} />
    </div>
  )
}`}
        </Snippet>
        <Snippet>
          {`'use client'

import { useState } from "react";

export default function Counter({ translations }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count => count - 1)}>{translations.decrement}</button>
      <span>{count}</span>
      <button onClick={() => setCount(count => count + 1)}>{translations.increment}</button>
    </div>
  )
}`}
        </Snippet>
        <Text>And it will display like this.</Text>
        <Counter translations={counter} />
      </section>
    </Page>
  )
}
