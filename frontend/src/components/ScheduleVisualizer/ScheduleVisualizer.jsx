// src/components/ScheduleVisualizer.jsx
import React, { useState } from "react";
import {
    isToday,
    isYesterday,
    isTomorrow,
    isWithinInterval,
    parseISO,
    isAfter,
    addDays,
    format,
} from "date-fns";
import { MoreHorizontal } from "lucide-react";
import AppointmentDetailsOverlay from "./AppointmentOverlay.jsx";

function getGroupLabel(date) {
    const today = new Date();
    const parsed = typeof date === "string" ? parseISO(date) : date;

    if (isYesterday(parsed)) return "Yesterday";
    if (isToday(parsed)) return "Today";
    if (isTomorrow(parsed)) return "Tomorrow";
    if (isWithinInterval(parsed, { start: today, end: addDays(today, 7) })) return "Next 7 days";
    if (isWithinInterval(parsed, { start: today, end: addDays(today, 30) })) return "Next 30 days";

    return format(parsed, "MMMM yyyy");
}

function ScheduleVisualizer({ tasks }) {
    const [hiddenGroups, setHiddenGroups] = useState(["Last 30 days", "Last 7 days"]);
    const [showMenu, setShowMenu] = useState(null);
    const [selectedAppointment, setSelectedAppointment] = useState(null);


    const grouped = tasks.reduce((acc, task) => {
        const label = getGroupLabel(task.date);
        (acc[label] = acc[label] || []).push(task);
        return acc;
    }, {});

    const allLabels = Array.from(new Set([
        ...Object.keys(grouped),
        ...hiddenGroups
    ]));

    const sortedLabels = allLabels.sort((a, b) => {
        const aDate = grouped[a]?.[0] ? parseISO(grouped[a][0].date) : new Date(0);
        const bDate = grouped[b]?.[0] ? parseISO(grouped[b][0].date) : new Date(0);
        return aDate - bDate;
    });

    const hideColumn = (label) => {
        setHiddenGroups((prev) => [...prev, label]);
        setShowMenu(null);
    };

    const unhideColumn = (label) => {
        setHiddenGroups((prev) => prev.filter((g) => g !== label));
    };

    return (
        <div className="overflow-x-auto pb-4">
            <div className="flex flex-col">
                <div className="bg-secondary/70 text-white px-6 py-3 rounded-md mb-4 w-full">
                    <h4 className="text-h4 font-heading">Agenda</h4>
                </div>
                <div className="flex gap-6 min-w-fit">
                    {sortedLabels.map((label) => {
                        const isHidden = hiddenGroups.includes(label);

                        if (isHidden) return null;

                        return (
                            <div key={label} className="w-64 flex-shrink-0 bg-secondary/70 rounded-md shadow-md flex flex-col max-h-[32rem]">
                                <div className="flex justify-between items-center px-3 pt-2 pb-1 relative">
                                    <div>
                                        <h5 className="text-subtitle-m font-bold text-white">{label}</h5>
                                        {grouped[label]?.[0] && (label === "Today" || label === "Tomorrow" || label === "Yesterday") && (
                                            <p className="text-[12px] text-white/65">
                                                {format(parseISO(grouped[label][0].date), "PPP")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowMenu(showMenu === label ? null : label)}
                                            className="text-white hover:text-white/80"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {showMenu === label && (
                                            <div className="absolute right-0 mt-1 bg-white shadow-md rounded-md z-10">
                                                <button
                                                    onClick={() => hideColumn(label)}
                                                    className="px-3 py-1 text-sm text-textMain hover:bg-primary w-full text-left"
                                                >
                                                    Hide
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4 overflow-y-auto px-3 pb-3 max-h-[calc(6*6rem)]">
                                    {grouped[label]?.map((task, i) => (
                                        <div
                                            key={i}
                                            className="bg-secondary text-white p-3 rounded-md shadow-md cursor-pointer hover:bg-secondary/90 transition-colors"
                                            onClick={() => setSelectedAppointment(task)}
                                        >
                                            <p className="font-bold text-body-m">{task.service}</p>
                                            <p className="text-body-xs">Hora - {task.stylist}</p>
                                            <p className="text-body-xs">Clienta {task.client}</p>
                                            <p className="text-body-xs">{format(parseISO(task.date), "do 'de' MMMM 'de' yyyy")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Hidden Groups List */}
                    {hiddenGroups.length > 0 && (
                        <div className="flex-shrink-0">
                            <h5 className="text-subtitle-m font-bold text-textMain mb-2">Hidden groups</h5>
                            <ul className="text-textMain/80 text-sm space-y-2">
                                {hiddenGroups.map((g) => (
                                    <li
                                        key={g}
                                        className="cursor-pointer hover:underline"
                                        onClick={() => unhideColumn(g)}
                                    >
                                        {g}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            <div>
                <AppointmentDetailsOverlay
                    appointment={selectedAppointment}
                    onClose={() => setSelectedAppointment(null)}
                />

            </div>
        </div>
    );
}

export default ScheduleVisualizer;
