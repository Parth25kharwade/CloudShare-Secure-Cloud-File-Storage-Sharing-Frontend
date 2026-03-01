import {BrowserRouter, Route, Routes} from "react-router-dom";
import Landing from "./Pages/Landing.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Upload from "./Pages/Upload.jsx";
import Myfiles from "./Pages/Myfiles.jsx";
import Subscription from "./Pages/Subscription.jsx";
import Transaction from "./Pages/Transaction.jsx";
import {RedirectToSignIn, SignedIn, SignedOut, SignIn} from "@clerk/clerk-react";
import {Toaster} from "react-hot-toast";

const App= ()=>{
    return(
        <BrowserRouter>
            <Toaster/>
            <Routes>
                <Route path="/" element={<Landing/>} />
                <Route
                    path="/dashboard"
                    element={
                        <>
                            <SignedIn>
                                <Dashboard/>
                            </SignedIn>

                            <SignedOut>
                                <RedirectToSignIn />
                            </SignedOut>
                        </>
                    }
                />
                <Route path="upload" element={
                    <>
                        <SignedIn>
                            <Upload/>
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                } />
                <Route path="my-files" element={
                    <>
                        <SignedIn>
                            <Myfiles/>
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                } />
                <Route path="subscriptions" element={
                    <>
                        <SignedIn>
                            <Subscription/>
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                } />
                <Route path="transactions" element={
                    <>
                        <SignedIn>
                            <Transaction/>
                        </SignedIn>

                        <SignedOut>
                            <RedirectToSignIn />
                        </SignedOut>
                    </>
                } />
                <Route path="/*" element={<RedirectToSignIn/>} />

            </Routes>
        </BrowserRouter>
    )
}
export default App;