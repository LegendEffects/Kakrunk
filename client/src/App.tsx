import { JoinScreen } from "./realms/player/screens/JoinScreen"
import { HashRouter, Route, Routes } from "react-router-dom"
import { HostScreen } from "./realms/host/screens/HostScreen"
import CreateQuizScreen from "./realms/quiz/CreateQuizScreen"
import ListQuizScreen from "./realms/quiz/ListQuizScreen"

function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<JoinScreen />} />
                {/*  TODO: */}
                <Route path="/quiz" element={<ListQuizScreen />} />
                <Route path="/quiz/create" element={<CreateQuizScreen />} />
                <Route path="/quiz/:quizId/host" element={<HostScreen />} />
            </Routes>
        </HashRouter>
    )
}

export default App
