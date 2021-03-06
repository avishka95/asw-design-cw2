import { useEffect, useState } from 'react';
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
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getMonthForConstant } from 'src/utils/constants';
import { fCurrency } from 'src/utils/formatNumber';
import useHttp from 'src/utils/http';
import { APP_CONFIG } from 'src/config';
import Label from './Label';


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

  const handleDelete = () => {
    props.handleConfirmation && props.handleConfirmation("Do you want to delete this?", props.deleteBudget())
  };

  useEffect(() => {

  }, [row, props.categoryMap]);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          {!row.totalExpense && !row.totalBudget ? null : <IconButton disabled={!row.totalExpense && !row.totalBudget} aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>}
        </TableCell>
        <TableCell component="th" scope="row">
          {getMonthForConstant(row.month)}
        </TableCell>
        <TableCell align="center"><Label variant="ghost" color={'success'}>{fCurrency(row.totalIncome)}</Label></TableCell>
        <TableCell align="center"><Label variant="ghost" color={'error'}>{fCurrency(row.totalExpense)}</Label></TableCell>
        <TableCell align="center"><Label variant="ghost" color={'warning'}>{fCurrency(row.totalBudget)}</Label></TableCell>
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
                    <TableCell align="center">Budget</TableCell>
                    <TableCell align="center">Earned</TableCell>
                    <TableCell align="center">Spent</TableCell>
                    {/* <TableCell align="center"></TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.categorylist.map((categoryRow) => (
                    <>{
                      !categoryRow.budget && !categoryRow.spent ? null :
                        <TableRow key={categoryRow.categoryId}>
                          <TableCell component="th" scope="row">
                            <Label variant="ghost" color={categoryMap[categoryRow.categoryId] && categoryMap[categoryRow.categoryId].isIncome ?'success':'error'}>
                              {categoryMap[categoryRow.categoryId] ? categoryMap[categoryRow.categoryId].categoryName : null}
                            </Label>
                          </TableCell>
                          <TableCell align="center">{fCurrency(categoryRow.budget)}</TableCell>
                          <TableCell align="center">{fCurrency(categoryRow.earned)}</TableCell>
                          <TableCell align="center">{fCurrency(categoryRow.spent)}</TableCell>
                          {/* <TableCell align="center">
                            <IconButton onClick={handleDelete} aria-label="expand row" size="small">
                              <DeleteIcon />
                            </IconButton>
                          </TableCell> */}
                        </TableRow>
                    }
                    </>

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


export default function BudgetTable(props) {

  useEffect(() => {
  }, [props.budgets, props.categoryMap]);

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
            <Row key={row.id} row={row} categoryMap={props.categoryMap} handleConfirmation={props.handleConfirmation} deleteBudget={props.deleteBudget} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
