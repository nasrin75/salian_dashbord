import React, { useEffect, useState } from 'react';
import HistoryModal from '../../components/inventory/HistoryModal';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getHistoryBy } from '../../api/HistoryApi';

function History() {
    const { inventoryID } = useParams()
    const [data, setData] = useState();
    const [openModal, setOpenModal] = useState(false)

    useEffect(() => {
        getHistoryBy("Inventories", inventoryID)
            .then(data => {
                setData(data.data['result'])
                console.log(data.data['result'])
            })
            .catch(() => toast.error('مشکلی در گرفتن تاریخچه رخ داده است.'))
    }, [])
    const closeModal = () => {
        setOpenModal(false)
    }
    return (
        //<p>dsfhdsh</p>
        <HistoryModal data={data} open={openModal} close={closeModal} />
    );
}

export default History;