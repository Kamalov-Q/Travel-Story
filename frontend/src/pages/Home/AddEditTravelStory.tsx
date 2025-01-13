import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from 'react-icons/md'
import { AddEditModalProps } from './Home'
import DateSelector from '../../components/input/DateSelector/DateSelector'

const AddEditTravelStory = ({ isShown, type, data, onClose, getAllStories }: AddEditModalProps) => {

    const handleAddOrUpdateClick = () => { }


    return (
        <div>
            <div className='flex items-center justify-between'>
                <h5 className='text-xl font-medium text-slate-700'>
                    {type === "add" ? "Add Story" : "Update Story"}
                </h5>

                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type === "add" ? <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdAdd className='text-lg' />Add Story
                    </button> : <>
                        <button className='btn-small' onClick={handleAddOrUpdateClick}>
                            <MdUpdate className='text-lg' />Update Story
                        </button>
                        <button className='btn-small btn-delete' onClick={onClose}>
                            <MdDeleteOutline className='text-lg' />Delete
                        </button>
                    </>}


                    <button className='' onClick={onClose}>
                        <MdClose className='text-xl text-slate-400' />
                    </button>

                </div>
            </div>

            <div>
                <div className='flex-1 flex flex-col gap-2 pt-4'>
                    <label className='input-label'>Title</label>
                    <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='A Day at the Great Wall' />

                    <div className='my-3'>
                        <DateSelector />
                    </div>

                </div>
            </div>

        </div>
    )
}

export default AddEditTravelStory
