import React from "React"
import { Input } from "../../components/Input"
import { Navbar } from "../../components/layout/Navbar"

const CreateQuizScreen: React.FC = () => {
    return (
        <div className="">
            <Navbar className="mb-8" />

            <div className="max-w-6xl mx-auto px-8">
                <h1 className="text-2xl font-bold">Create a quiz</h1>

                <form>
                    <Input placeholder="name" type="name" />
                </form>
            </div>
        </div>
    )
}

export default CreateQuizScreen
