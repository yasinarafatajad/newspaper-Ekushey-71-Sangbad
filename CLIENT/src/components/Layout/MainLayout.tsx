import { ReactNode } from "react"

interface MainLayoutProps {
    children: ReactNode
}

export const MainLayout = ({children} : MainLayoutProps) => {
    return (
        <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-8 md:gap-12">
                {children}
            </div>
        </div>
    )
}
