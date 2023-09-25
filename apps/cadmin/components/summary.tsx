"use client"
import { Query } from "@/lib/people.db.types";
import { Progress } from "@nextui-org/react";

export default function Summary({ people }: { people: Query }) {
    const totalInvited = people.Count
    const peopleComing = people.Items?.filter(p => p.isAssisting?.BOOL === true) || []
    const totalAnswers = people.Items?.filter(p => p.isAssisting !== undefined).length
    const totalInvitedComing = peopleComing.length
    const totalCompanions = peopleComing.reduce((total, next) => total + Number(next.additionalPeople?.N || 0), 0)
    const totalComing = totalInvitedComing + totalCompanions

    return (
        <div className="container mx-auto w-80 flex flex-col text-center gap-5 pt-10 pb-5">
            <div className="flex justify-between">
                <strong>People invited:</strong><span>{totalInvited}</span>
            </div>
            <div className="flex justify-between">
                <strong>Answers:</strong><span>{totalAnswers}</span>
            </div>
            <Progress aria-label="People answering.." value={Math.round((totalAnswers || 0) / totalInvited * 100)} isStriped size="sm" className="max-w-md pt-2 pb-5" />
            <div className="flex justify-between">
                <strong>Total people coming:</strong><span>{totalComing}</span>
            </div>
            <div className="flex justify-between ml-5">
                <strong>Invited:</strong><span>{totalInvitedComing}</span>
            </div>
            <div className="flex justify-between ml-5">
                <strong>Companions:</strong><span>{totalCompanions}</span>
            </div>
        </div>
    );

}