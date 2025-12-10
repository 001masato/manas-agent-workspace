import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

export const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const startDate = startOfMonth(currentDate);
    const endDate = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

    return (
        <div className="bg-black/40 backdrop-blur-md border border-cyber-cyan/30 p-4 rounded-sm neon-border-sm">
            <div className="flex items-center justify-between mb-4 border-b border-cyber-cyan/20 pb-2">
                <div className="flex items-center gap-2 text-cyber-cyan">
                    <Calendar size={16} />
                    <span className="font-bold tracking-widest">{format(currentDate, 'MMMM yyyy').toUpperCase()}</span>
                </div>
                <div className="flex gap-1">
                    <button onClick={prevMonth} className="p-1 hover:bg-cyber-cyan/20 rounded text-cyber-cyan transition-colors">
                        <ChevronLeft size={16} />
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:bg-cyber-cyan/20 rounded text-cyber-cyan transition-colors">
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
                {['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'].map(d => (
                    <div key={d} className="text-cyber-cyan/50 py-1">{d}</div>
                ))}

                {Array.from({ length: startDate.getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}

                {days.map(day => {
                    const isSelected = isToday(day);
                    return (
                        <div
                            key={day.toISOString()}
                            className={`
                                py-1 relative group cursor-default transition-all duration-300
                                ${isSelected ? 'bg-cyber-cyan text-black font-bold shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'text-gray-400 hover:text-white hover:bg-white/5'}
                            `}
                        >
                            {format(day, 'd')}
                            {/* Random simulated events */}
                            {Math.random() > 0.8 && !isSelected && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-cyber-magenta rounded-full" />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-3 flex justify-between text-[10px] text-cyber-cyan/40 font-mono">
                <span>SYS.DATE: {format(new Date(), 'yyyy-MM-dd')}</span>
                <span>CAL.VER: 2.1</span>
            </div>
        </div>
    );
};
