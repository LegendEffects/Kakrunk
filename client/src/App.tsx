import "./App.css"

import { JoinScreen } from "./screens/JoinScreen"
import { HashRouter, Route, Routes } from "react-router-dom"
import { HostScreen } from "./screens/host/HostScreen"

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<JoinScreen />} />
                <Route path="/host" element={<HostScreen />} />
            </Routes>
        </HashRouter>
    )
}

export default App
