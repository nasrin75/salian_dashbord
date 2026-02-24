
import { useState } from 'react';
import DetailsModal from '../../components/History/DetailsModal';
import { useParams } from 'react-router-dom';


export default function Details() {
  const { historyID } = useParams();
  const [open, setOpen] = useState(true)

  return (
    <DetailsModal open={open} />
  );
}
