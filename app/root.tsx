import { type V2_MetaFunction, type LinksFunction } from '@remix-run/cloudflare'
import { Link, Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from '@remix-run/react'
import stylesheet from '~/tailwind.css'

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: stylesheet }]

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'Asase Shrine' },
    { name: 'charset', content: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ]
}

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="bg-gray-800">
          <div className="mx-auto max-w-lg px-4">
            <div className="space-y-1  pt-2 pb-3">
              <Link to="/" className="pr-2 text-white">
                Home
              </Link>

              <Link to="/t/new" className="px-2 text-white">
                Track
              </Link>
            </div>
          </div>
        </nav>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
