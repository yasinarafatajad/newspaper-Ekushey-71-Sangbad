import { ReactNode } from "react"

interface mainLayout{
    children: ReactNode
}

export const MainLayout = ({children} : mainLayout) => {
    return (
        <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                {children}
            </div>
        </div>
    )
}
