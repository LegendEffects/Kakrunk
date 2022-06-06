import React from "react"
import { Link } from "react-router-dom"
import { Quiz } from "shared"
import { Container } from "../../components/layout/Container"
import { Navbar } from "../../components/layout/Navbar"
import { QuizCard } from "../../components/quiz/QuizCard"
import useFetch from "../../hooks/useFetch"

const ListQuizScreen: React.FC = () => {
    const { data, error } = useFetch<{ data: Quiz[] }>(`${import.meta.env.VITE_BASE_API_URL}/quizzes`)

    return (
        <div>
            <Navbar className="mb-8" />

            <Container>
                <h1 className="text-2xl font-bold">Choose a quiz</h1>

                {error && <div>Oops! We've encountered an error.</div>}

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data
                        ? data.data.map((quiz) => (
                              <Link key={quiz.id} to={`/quiz/${quiz.id}/host`}>
                                  <QuizCard quiz={quiz} />
                              </Link>
                          ))
                        : null}
                </div>
            </Container>
        </div>
    )
}

export default ListQuizScreen
