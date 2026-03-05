"use client"
import { useParams } from 'next/navigation'

const Page = () => {
    const { slug } = useParams()

    return (
        <div>{slug}</div>
    )
}

export default Page