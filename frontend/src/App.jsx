import Button from "./components/Button";
import Navbar from "./components/Navbar/Navbar.jsx";
function App() {
    return (
        <>
            <Navbar/>
            <div className="min-h-screen bg-primaryLight text-textMain p-8 space-y-12 font-body">
                <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                    <h1 className="text-h1 font-bold font-heading">Heading 1</h1>
                    <h2 className="text-h2 font-bold font-heading">Heading 2</h2>
                    <h3 className="text-h3 font-bold font-heading">Heading 3</h3>
                    <h4 className="text-h4 font-bold font-heading">Heading 4</h4>
                    <h5 className="text-h5 font-bold font-heading">Heading 5</h5>
                    <h6 className="text-h6 font-bold font-heading">Heading 6</h6>

                    <div className="space-y-2">
                        <p className="text-subtitle-m font-medium">Subtitle M</p>
                        <p className="text-subtitle-s font-medium">Subtitle S</p>

                        <p className="text-body-l">Body L — regular 18px</p>
                        <p className="text-body-m">Body M — regular 16px</p>
                        <p className="text-body-s">Body S — regular 14px</p>
                        <p className="text-body-xs">Body XS — regular 12px</p>
                        <p className="text-body-xxs">Body XXS — regular 10px</p>
                    </div>

                    <div className="space-x-4 pt-6">
                        <div className="space-x-4 pt-6">
                            <Button type="light">Light Button</Button>
                            <Button type="dark">Dark Button</Button>
                            <Button type="transparent">Transparent Button</Button>
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}

export default App
