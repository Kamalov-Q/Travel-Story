import { DayPicker } from "react-day-picker"
import moment from "moment"
import { MdClose, MdOutlineDateRange } from "react-icons/md"
import { useState } from "react"

interface DateSelectorProps {
    date: Date | undefined,
    setDate: (date: Date | undefined) => void
}

const DateSelector = ({ date, setDate }: DateSelectorProps) => {
    const [openDatePicker, setOpenDatePicker] = useState<boolean>(false);
    return (
        <div className="">
            <button className="inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer" onClick={() => setOpenDatePicker(true)}>
                <MdOutlineDateRange className="text-lg" />
                {date ? moment(date).format("Do MMM YYYY") : moment().format("Do MMM YYYY")}
            </button>

            <div className="overflow-y-auto p-5 bg-sky-50/80 rounded-lg relative pt-9">
                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2" onClick={() => {
                    setOpenDatePicker(false);
                }
                }>
                    <MdClose className="text-xl text-sky-600" />
                </button>

                {openDatePicker && <DayPicker mode="single" captionLayout="dropdown" selected={date ?? undefined} onSelect={setDate} pagedNavigation />}

            </div>

        </div>
    )
}

export default DateSelector
