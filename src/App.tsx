import {Suspense, lazy} from 'react';
import {Route, Routes} from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import SignIn from './pages/Authentication/SignIn';
import useMiddleware from "./hooks/useMidleware.ts";
const DefaultLayout = lazy(() => import('./layout/DefaultLayout'));
const Slide = lazy(() => import('./pages/slideshow/Slide.tsx'));
const Category = lazy(() => import('./pages/category/Category'));
const Content = lazy(() => import('./pages/content/Content'));
const CreateContent = lazy(() => import('./pages/content/CreateContent'));
const EditContent = lazy(() => import('./pages/content/EditContent'));
const User = lazy(() => import('./pages/user/User'));
const Page404 = lazy(() => import('../src/pages/Page404'));
const Loader = lazy(() =>  import('./common/Loader') );

function App() {
    const [isLogin] = useMiddleware();
    return isLogin ? (
        <Suspense fallback={ <Loader/>}>
            <Routes>
                <Route element={<DefaultLayout/>}>
                    <Route path="/" element={<Dashboard/>}/>
                    <Route
                        path="/category"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Category/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/content"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Content/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/content/create"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <CreateContent/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/content/edit/:id"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <EditContent/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/user"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <User/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="/slide"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Slide/>
                            </Suspense>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <Suspense fallback={<Loader/>}>
                                <Page404/>
                            </Suspense>
                        }
                    />
                </Route>
                
            </Routes>
        </Suspense>
    ) : <SignIn/>;
}

export default App;
