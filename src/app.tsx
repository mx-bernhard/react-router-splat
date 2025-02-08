import { useContext } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useResolvedPath,
  useLocation,
  Outlet,
  useParams,
  UNSAFE_RouteContext,
} from "react-router";

// Parent Komponente (nur als Container für Child)
function RenderHookValues({ desc }: { desc: string }) {
  const parentRoutePathname = useResolvedPath(".", { relative: "path" });
  const routePathname = useResolvedPath(".", { relative: "route" });
  const params = useParams();
  const routeContext = useContext(UNSAFE_RouteContext);
  const location = useLocation();
  return (
    <div style={{ border: "1px dashed black", padding: "8px", margin: "8px" }}>
      <h3>{"<RenderHookValues /> " + desc}</h3>
      <p>
        <code>{"useResolvedPath('.', { relative: 'path' } ):"}</code>
        <code style={{ background: "lightgrey" }}>
          {routePathname.pathname}
        </code>
      </p>
      <p>
        <code>{"useResolvedPath('..', { relative: 'route' } ):"}</code>
        <code style={{ background: "lightgrey" }}>
          {parentRoutePathname.pathname}
        </code>
      </p>
      <p>
        <code>{"useParms():"}</code>
        <code style={{ background: "lightgrey" }}>
          {JSON.stringify(params)}
        </code>
      </p>
      <p>
        <code>{"routeContext.matches:"}</code>
        <code style={{ background: "lightgrey" }}>
          {JSON.stringify(
            (() => {
              const matches4Stringify = routeContext.matches.map((match) => ({
                ...match,
                route: {
                  path: match.route.path,
                },
              }));
              return matches4Stringify;
            })(),
            undefined,
            3
          )
            .split("\n")
            .map((line, index) => (
              <code
                key={index}
                style={{ display: "block", whiteSpace: "pre-wrap" }}
              >
                {line}
              </code>
            ))}
        </code>
      </p>
      <div style={{ border: "3px solid black", padding: "8px", margin: "8px" }}>
        Outlet
        <Outlet />
      </div>
    </div>
  );
}

const Subrouting = ({ desc }: { desc: string }) => {
  return (
    <div style={{ border: "3px solid green", margin: "8px", padding: "8px" }}>
      <h2>{"<Subrouting />"}</h2>
      <h3>{desc}</h3>
      <RenderHookValues desc="for <Subrouting />" />
      <Routes>
        <Route
          index
          element={<RenderHookValues desc="from <Subrouting /> index route" />}
        />
        <Route
          path="routing-parent/:id/*"
          element={
            <Subrouting desc="from <Subrouting /> routing-parent/:id/*" />
          }
        />
      </Routes>
    </div>
  );
};

function Home() {
  const location = useLocation();
  return (
    <div>
      <h2>Home</h2>
      <p>
        current pathname: <code>{location.pathname}</code>
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <h1>{"<App />"}</h1>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="parent/:parentId"
          element={<RenderHookValues desc="for <App/> parent/:parentId" />}
        >
          <Route
            path="child/:childId"
            element={<RenderHookValues desc="for <App/> child/:childId" />}
          />
        </Route>
        <Route path="foo/*" element={<Subrouting desc="for <App/> foo/*" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
