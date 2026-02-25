import styled from '@emotion/styled';

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Slide from '@mui/material/Slide';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { forwardRef, useTransition } from 'react';
import { Table } from 'reactstrap';
import { green, red } from '../../shared-theme/themePrimitives';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import useTranslate from '../../hooks/useTranslate/useTranslate';

//style
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: green[700],
    color: theme.palette.common.white,
    textAlign: 'center'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const BeforeDataStyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: red[700],
    color: theme.palette.common.white,
    textAlign: 'center'
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



export default function HistoryModal(props) {
  const {
    open, close, data
  } = props

  const {getMessage} = useTranslate();

  if (data.newData) {
    return (
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted

        onClose={close}
        aria-describedby="alert-dialog-slide-description"
        sx={{ flexGrow: 1, width: '100%' }}
      >
        <DialogContent dividers>
          <DialogTitle>دیتاهای جدید</DialogTitle>
          <TableContainer >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  {
                    Object.entries(data.newData).map((val) => {
                      return <StyledTableCell align="right">{getMessage(val[0])}</StyledTableCell>
                    })
                  }
                </StyledTableRow>
              </TableHead>
              <TableBody>

                <StyledTableRow>
                  {
                    Object.entries(data.newData).map((val) => {
                      return <StyledTableCell align="right">{getMessage(val[1])}</StyledTableCell>
                    })
                  }
                </StyledTableRow>

              </TableBody>
            </Table>
          </TableContainer>
          <Divider />
          <DialogTitle>دیتاهای قبلی</DialogTitle>
          <TableContainer >
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <StyledTableRow>
                  {
                    Object.entries(data.oldData).map((val) => {
                       return <BeforeDataStyledTableCell align="right">{getMessage(val[0])}</BeforeDataStyledTableCell>
                    })
                  }
                </StyledTableRow>
              </TableHead>
              <TableBody>

                <StyledTableRow>
                  {
                    Object.entries(data.oldData).map((val) => {
                      return <BeforeDataStyledTableCell align="right">{getMessage(val[1])}</BeforeDataStyledTableCell>
                    })
                  }
                </StyledTableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

      </Dialog >
    )
  }

  return (
    <Dialog
      open={open}
      slots={{
        transition: Transition,
      }}
      keepMounted

      onClose={close}
      aria-describedby="alert-dialog-slide-description"
      sx={{ flexGrow: 1, width: '100%' }}
    >
      <DialogContent dividers>
        <Typography>موردی یافت نشد</Typography>
      </DialogContent>
    </Dialog>)

}