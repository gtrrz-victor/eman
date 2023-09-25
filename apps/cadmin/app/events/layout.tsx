import NavigationHeader from "@/components/navigation-header";
import { fetchPeople } from "@/lib/people";
import Summary from "@/components/summary";

export default async function EventLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const people = await fetchPeople({ devMode: process.env.NODE_ENV === 'development' })
    return (
        <>
            <NavigationHeader />
            <Summary people={people} />
            <div>
                {children}
            </div>
        </>

    );
}
