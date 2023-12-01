'use client'
import React from "react";

import { People } from "@/lib/people.db.types";
import { Button, Chip, ChipProps, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Tooltip } from "@nextui-org/react";
import { sendNotification } from "@/lib/people";
import { differenceInMinutes } from "date-fns";

type AnswerStatus = 'yes' | 'no' | 'unknown'

const statusColorMap: Record<AnswerStatus, ChipProps["color"]> = {
    yes: "success",
    no: "danger",
    unknown: "warning",
};

const columns = [
    { name: "Name", uid: "name" },
    { name: "Assisting", uid: "isAssisting" },
    { name: "Answered", uid: "answered" },
    { name: "Additional People", uid: "extra" },
    { name: "Notifications", uid: "notifications" },
    { name: "ACTIONS", uid: "actions" },
];

export default function PeopleTableView({ guests, invalidate }: { guests: People[], invalidate: () => Promise<void> }) {
    const SendIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>

    )
    const renderCell = React.useCallback((user: People, columnKey: React.Key) => {
        const securityWindowBetweenSMS = 60 // minutes
        const lastNotificationDatetime = user.notifications?.L.sort((a, b) => Number(a.M.datetime.S) - Number(b.M.datetime.S)).at(0)
        const lastNotifDate = new Date(Number(lastNotificationDatetime?.M.datetime.S))

        switch (columnKey) {
            case "name":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{user.name.S}</p>
                        <p className="text-bold text-sm capitalize text-default-400">{user.phoneNumber.S}</p>
                    </div>
                );
            case "isAssisting":
                const isAssisting = user.isAssisting?.BOOL === true
                return (
                    <Chip className="capitalize" color={statusColorMap[isAssisting ? 'yes' : 'no']} size="sm" variant="flat">
                        {isAssisting ? 'Yes' : 'No'}
                    </Chip>
                );
            case "answered":
                const hasAnswered = user.isAssisting !== undefined
                return (
                    <Chip className="capitalize" color={statusColorMap[hasAnswered ? 'yes' : 'unknown']} size="sm" variant="flat">
                        {hasAnswered ? 'Yes' : 'No'}
                    </Chip>
                );
            case "extra":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{user.additionalPeople?.N || 0}</p>
                    </div>
                );
            case "notifications":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">{user.notifications?.L.length || 0}</p>
                        {lastNotificationDatetime && (<p className="text-bold text-xs capitalize text-default-400" suppressHydrationWarning>{lastNotifDate.toLocaleDateString()}-{lastNotifDate.toLocaleTimeString()}</p>
                        )}
                    </div>
                );
            case "actions":
                const isLastNotifTooClose = differenceInMinutes(
                    new Date(),
                    lastNotifDate
                ) < securityWindowBetweenSMS
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Send sms">
                            <Button isIconOnly color="danger" variant="faded" isDisabled={isLastNotifTooClose} onClick={
                                async () => {
                                    await sendNotification(user.id.S)
                                    await invalidate()
                                }
                            }>
                                <SendIcon />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return undefined;
        }
    }, []);

    return (
        <Table aria-label="Example table with custom cells">
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={guests}>
                {(item) => (
                    <TableRow key={item.id.S}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}


