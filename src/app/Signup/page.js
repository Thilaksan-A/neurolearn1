import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function Signup({ onSuccess }) {

    // const handleSubmit = (e) => {
    //     e.preventDefault()
    //     onSuccess();
    // }

    return (
        <div className="flex justify-center items-center min-h-screen flex-col">
            <div className="p-6 rounded-2xl shadow w-90">
                <p className="text-center pt-5 text-2xl">Sign Up</p>
                {/* <form className="py-3 px-6" onSubmit={handleSubmit}> */}
                    <div className="py-3">
                        <p className="mb-2 text-black py-2">Name *</p>
                        <Input type="text" placeholder="Name" required/>
                    </div>
                    <div className="py-3">
                        <p className="mb-2 text-black">Surname</p>
                        <Input type="text" placeholder="Surname" />
                    </div>
                    <div className="py-3">
                        <p className="mb-2 text-black">Email *</p>
                        <Input type="text" placeholder="Email" required/>
                    </div>
                    <div className="py-3">
                        <p className="mb-2 text-black">Password *</p>
                        <Input type="text" placeholder="Password" required/>
                    </div>
                    <div className="pt-4">
                        <Button type="submit" className="w-full">Next</Button>
                    </div>
                {/* </form> */}
            </div>
        </div>
    )
}

export default Signup;
