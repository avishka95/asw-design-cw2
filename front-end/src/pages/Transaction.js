import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect, useReducer } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  LinearProgress
} from '@mui/material';
// components
import Page from '../components/Page';
import Label from '../components/Label';
import Scrollbar from '../components/Scrollbar';
import SearchNotFound from '../components/SearchNotFound';
import TransactionDialog from '../dialogs/TransactionDialog';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../components/_dashboard/user';
import AppContext from '../context/AppContext';
//
import TRANSACTION_LIST from '../_mocks_/transactions';
import CATEGORIES_LIST from '../_mocks_/categories';
import useHttp from 'src/utils/http';
import { APP_CONFIG } from 'src/config';
import { getMonthForConstant, getMonthObjForConstant } from 'src/utils/constants';
import {fCurrency} from '../utils/formatNumber';


// ----------------------------------------------------------------------

// function ccyFormat(num) {
//   return `$${num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
// }

const TABLE_HEAD = [
  { id: 'description', label: 'Description', alignCenter: true },
  { id: 'amount', label: 'Amount', alignCenter: true },
  { id: 'month', label: 'Month', alignCenter: true },
  { id: 'category', label: 'Category', alignCenter: true },
  { id: '' }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

const ACTIONS = {
  SET_TRANSACTIONS: 'SET_TRANSACTIONS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  HANDLE_RESET: 'HANDLE_RESET',
}

const transactionsReducer = (curTrasactionState, action) => {
  switch (action.type) {
    case ACTIONS.SET_TRANSACTIONS:
      return { ...curTrasactionState, transactions: action.transactions, transactionMap: action.transactionMap };
    case ACTIONS.SET_CATEGORIES:
      return { ...curTrasactionState, categories: action.categories, categoryMap: action.categoryMap };
    default:
      throw new Error('Should not get here');
  }
}

export default function Transaction(props) {
  const { isLoading, data, error, sendRequest, reqExtra, isOpen, } = useHttp();
  const [{ transactions, transactionMap, categories, categoryMap }, dispatchTransactions] = useReducer(transactionsReducer,
    { transactions: [], transactionMap: {}, categories: [], categoryMap: {} });
  const [openTransactionDialog, setOpenTransactionDialog] = useState(false);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [transactionId, setTransactionId] = useState(null);

  const loadTransactions = () => {
    sendRequest(APP_CONFIG.APIS.GET_TRANSACTIONS, 'GET', null, APP_CONFIG.APIS.GET_TRANSACTIONS);
  };

  const deleteTransaction = (id) => () => {
    sendRequest(APP_CONFIG.APIS.DELETE_TRANSACTION + "/" + id, 'DELETE', null, APP_CONFIG.APIS.DELETE_TRANSACTION);
  };

  const getCategories = () => {
    sendRequest(APP_CONFIG.APIS.GET_CATEGORIES, 'GET', null, APP_CONFIG.APIS.GET_CATEGORIES);
  };

  const handleOpenTransactionDialog = () => {
    setOpenTransactionDialog(true);
  };

  const handleOpenUpdateTransactionDialog = (id) => (event) => {
    setOpenTransactionDialog(true);
    setTransactionId(id);
  };

  const handleCloseTransactionDialog = () => {
    setOpenTransactionDialog(false);
    setTransactionId(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = transactions.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - transactions.length) : 0;

  const filteredTransactions = applySortFilter(
    transactions,
    getComparator(order, orderBy),
    filterName
  );

  const isUserNotFound = filteredTransactions.length === 0;

  useEffect(() => {
    switch (reqExtra) {
      case APP_CONFIG.APIS.GET_TRANSACTIONS:
        // var data = TRANSACTION_LIST;
        if (data && !error) {
          if (Array.isArray(data)) {
            var tempTransactionMap = {};
            data.forEach(e => {
              tempTransactionMap[e.transactionId] = e;
            })
            dispatchTransactions({ type: ACTIONS.SET_TRANSACTIONS, transactions: data, transactionMap: tempTransactionMap });
          }
        }
        break;
      case APP_CONFIG.APIS.DELETE_TRANSACTION:
        if (data && !error) {
          props.handleSnackbar("Successfully deleted transaction!", "success");
          loadTransactions();
        } else if (error) {
          props.handleSnackbar("Failed to delete transaction!", "error");
        }
        break;
      case APP_CONFIG.APIS.GET_CATEGORIES:
        // var data = CATEGORIES_LIST;
        if (data && !error) {
          var categoryMapTemp = {};
          if (Array.isArray(data)) {
            data.forEach(e => {
              categoryMapTemp[e.categoryId] = e;
            });
          }

          dispatchTransactions({ type: ACTIONS.SET_CATEGORIES, categories: data, categoryMap: categoryMapTemp });
        } else if (error) {
          props.handleSnackbar("Failed to fetch categories!", "error");
        }
        break;
      default:
        break;
    }
  }, [data, reqExtra, isOpen, isLoading, error]);

  useEffect(() => {
    loadTransactions();
    getCategories();
  }, []);

  return (
    <Page title={"Transactions | " + APP_CONFIG.APP_NAME}>
      <AppContext.Consumer>
        {context => {
          return (<>
            <Container>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4" gutterBottom>
                  Transactions
                </Typography>
                <Button
                  onClick={handleOpenTransactionDialog}
                  variant="contained"
                  component={RouterLink}
                  to="#"
                  startIcon={<Icon icon={plusFill} />}
                >
                  New Transactions
                </Button>
              </Stack>

              <Card>
                {/* <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
          /> */}
                <div>
                  {isLoading && <LinearProgress />}
                </div>
                <Scrollbar>
                  <TableContainer sx={{ minWidth: 800 }}>
                    <Table>
                      <UserListHead
                        order={order}
                        orderBy={orderBy}
                        headLabel={TABLE_HEAD}
                        rowCount={transactions.length}
                        numSelected={selected.length}
                        onRequestSort={handleRequestSort}
                        onSelectAllClick={handleSelectAllClick}
                      />
                      <TableBody>
                        {filteredTransactions
                          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                          .reverse().map((row) => {
                            const { transactionId, description, amount, isIncome, month, categoryId } = row;
                            const isItemSelected = selected.indexOf(transactionId) !== -1;
                            return (
                              <TableRow
                                hover
                                key={transactionId}
                                tabIndex={-1}
                                role="checkbox"
                                selected={isItemSelected}
                                aria-checked={isItemSelected}
                              >
                                <TableCell padding="checkbox">
                                  {/* <Checkbox
                                    checked={isItemSelected}
                                    onChange={(event) => handleClick(event, transactionId)}
                                  /> */}
                                </TableCell>
                                <TableCell align="center" component="th" scope="row" padding="none" >
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    {/* <Avatar alt={transactionId} src={avatarUrl} /> */}
                                    <Typography variant="subtitle2" noWrap>
                                      {description}
                                    </Typography>
                                  </Stack>
                                </TableCell>
                                <TableCell color="success" align="center">
                                  <Label variant="ghost" color={isIncome ? 'success' : 'error'}>
                                    {fCurrency(amount)}
                                  </Label>
                                </TableCell>
                                <TableCell align="center">{getMonthForConstant(month)}</TableCell>
                                <TableCell align="center">{categoryId && categoryMap[categoryId] ? categoryMap[categoryId].categoryName : null}</TableCell>
                                {/* <TableCell align="left">{isVerified ? 'Yes' : 'No'}</TableCell> */}
                                {/* <TableCell align="left">
                            <Label variant="ghost" color={isIncome ? 'success' : 'error'}>
                              {sentenceCase(isIncome ? 'income' : 'expense')}
                            </Label>
                          </TableCell> */}

                                <TableCell align="right">
                                  <UserMoreMenu onDelete={() => {
                                    context.handleConfirmation("Do you want to delete this transaction?", deleteTransaction(transactionId))
                                  }} onEdit={handleOpenUpdateTransactionDialog(transactionId)} />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        {emptyRows > 0 && (
                          <TableRow style={{ height: 53 * emptyRows }}>
                            <TableCell colSpan={6} />
                          </TableRow>
                        )}
                      </TableBody>
                      {isUserNotFound && (
                        <TableBody>
                          <TableRow>
                            <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                              <SearchNotFound searchQuery={filterName} />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      )}
                    </Table>
                  </TableContainer>
                </Scrollbar>

                <TablePagination
                  rowsPerPageOptions={[10, 20, 50]}
                  component="div"
                  count={transactions.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Card>
            </Container>
            <TransactionDialog open={openTransactionDialog} handleClose={handleCloseTransactionDialog} handleSnackbar={context.handleSnackbar} load={loadTransactions}
              data={{
                transactionId,
                isIncome: transactionMap[transactionId] ? transactionMap[transactionId].isIncome : true,
                amount: transactionMap[transactionId] ? transactionMap[transactionId].amount : 0.0,
                description: transactionMap[transactionId] ? transactionMap[transactionId].description : "",
                month: transactionMap[transactionId] ? getMonthObjForConstant(transactionMap[transactionId].month) : null,
                category: 1,
              }} />
          </>);
        }}
      </AppContext.Consumer>

    </Page>
  );
}
