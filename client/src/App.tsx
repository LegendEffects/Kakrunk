import { JoinScreen } from "./realms/player/screens/JoinScreen"
import { HashRouter, Route, Routes } from "react-router-dom"
import { HostScreen } from "./realms/host/screens/HostScreen"

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<JoinScreen />} />
                {/*  TODO: */}
                <Route path="/quiz" element={<HostScreen />} />
                <Route path="/quiz/:quizId/host" element={<HostScreen />} />
            </Routes>
        </HashRouter>
    )
}

export default App
