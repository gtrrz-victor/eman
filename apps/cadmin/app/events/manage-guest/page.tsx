import PeopleTableView from "@/components/people-table-view"
import { fetchPeople } from "@/lib/people"

export default async function ManageGuest() {
    const people = await fetchPeople({ devMode: process.env.NODE_ENV === 'development' })

    return <PeopleTableView guests={people.Items || []} />
}