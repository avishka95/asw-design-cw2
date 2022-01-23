import {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getMonthForConstant } from 'src/utils/constants';
import useHttp from 'src/utils/http';
import { APP_CONFIG } from 'src/config';

function createData(month, income, expense) {
  return {
    month,
    income,
    expense,
    history: [
      {
        date: 'Entertainment',
        customerId: 20,
        amount: 3
      },
      {
        date: 'Travel',
        customerId: 'Anonymous',
        amount: 1
      }
    ]
  };
}

function Row(props) {
  const { row, categoryMap } = props;
  const [open, setOpen] = useState(false);

  useEffect(()=>{

  },[row, props.categoryMap]);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {getMonthForConstant(row.month)}
        </TableCell>
        <TableCell align="center">{row.totalIncome}</TableCell>
        <TableCell align="center">{row.totalExpense}</TableCell>
        <TableCell align="center">{row.totalBudget}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="button" gutterBottom component="div">
                Category Breakdown
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Category</TableCell>
                    <TableCell>Budget</TableCell>
                    <TableCell align="right">Spent</TableCell>
                    {/* <TableCell align="right">Total price ($)</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.categorylist.map((categoryRow) => (
                    <TableRow key={categoryRow.categoryId}>
                      <TableCell component="th" scope="row">
                        {categoryMap[categoryRow.categoryId]? categoryMap[categoryRow.categoryId].name : null}
                      </TableCell>
                      <TableCell>{categoryRow.spent}</TableCell>
                      <TableCell align="right">{categoryRow.spent}</TableCell>
                      {/* <TableCell align="right">
                        {Math.round(categoryRow.amount * row.price * 100) / 100}
                      </TableCell> */}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

// Row.propTypes = {
//   row: PropTypes.shape({
//     calories: PropTypes.number.isRequired,
//     carbs: PropTypes.number.isRequired,
//     fat: PropTypes.number.isRequired,
//     history: PropTypes.arrayOf(
//       PropTypes.shape({
//         amount: PropTypes.number.isRequired,
//         customerId: PropTypes.string.isRequired,
//         date: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     name: PropTypes.string.isRequired,
//     price: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired
//   }).isRequired
// };

export default function BudgetTable(props) {
  // const { isLoading, data, error, sendRequest, reqExtra, isOpen } = useHttp();

  // useEffect(() => {
  //   switch (reqExtra) {
  //     case APP_CONFIG.APIS.GET_TRANSACTIONS:
  //       if (data) {

  //       }
  //       //TODO
  //       dispatchTransactions({ type: ACTIONS.SET_TRANSACTIONS, transactions: TRANSACTION_LIST });
  //       break;
  //     default:
  //       break;
  //   }
  // }, [data, reqExtra, isOpen, isLoading, error]);

  useEffect(()=>{
  },[props.budgets, props.categoryMap]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Month</TableCell>
            <TableCell align="center">Total Income</TableCell>
            <TableCell align="center">Total Expense</TableCell>
            <TableCell align="center">Budget</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.budgets.map((row) => (
            <Row key={row.id} row={row} categoryMap={props.categoryMap}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
