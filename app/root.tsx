import { type MetaFunction } from 'react-router';
import { Link, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import '~/tailwind.css'

export const meta: MetaFunction = () => {
  return [
    { title: 'Asase Shrine' },
    { name: 'charset', content: 'utf-8' },
    { name: 'viewport', content: 'width=device-width,initial-scale=1' },
  ]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <nav className="bg-gray-800">
          <div className="mx-auto max-w-lg px-4">
            <div className="space-y-1  pb-3 pt-2">
              <Link to="/" className="pr-2 text-white">
                Home
              </Link>

              <Link to="/t/new" className="px-2 text-white">
                Track
              </Link>
            </div>
          </div>
        </nav>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return <Outlet />
}
